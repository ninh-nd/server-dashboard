import { Request, Response } from "express";
import MyOctokit, { MyOctokitType } from "../octokit";
import { errorResponse, successResponse } from "../utils/responseFormat";

export async function getWorkflows(req: Request, res: Response) {
  const { url } = req.query as { url: string };
  if (!url) {
    return res.json(errorResponse("Missing project's url"));
  }
  const urlObject = new URL(url);
  const { hostname } = urlObject;
  const [owner, repo] = urlObject.pathname.split("/").slice(1);
  if (hostname.includes("github.com")) {
    const accessToken = req.user?.thirdParty.find(
      (x) => x.name === "Github"
    )?.accessToken;
    const octokit = new MyOctokit({
      auth: accessToken,
    });
    try {
      const { data } = await octokit.rest.actions.listRepoWorkflows({
        owner,
        repo,
      });
      let workflows = [];
      for (const workflow of data.workflows) {
        if (workflow.path.endsWith(".yml")) {
          const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: workflow.path,
          });
          const fileName = workflow.path.split("/").pop();
          workflows.push({
            name: fileName,
            path: workflow.path,
            // @ts-ignore
            content: Buffer.from(data.content, "base64").toString("utf-8"),
          });
        }
      }
      return res.json(
        successResponse(workflows, "Successfully fetched workflows")
      );
    } catch (error) {
      return res.json(errorResponse("Failed to fetch workflows"));
    }
  }
}

export async function pushNewWorkflow(req: Request, res: Response) {
  const { url, branch, data, message } = req.body;
  const urlObject = new URL(url);
  const { hostname } = urlObject;
  const [owner, repo] = urlObject.pathname.split("/").slice(1);
  if (hostname.includes("github.com")) {
    const accessToken = req.user?.thirdParty.find(
      (x) => x.name === "Github"
    )?.accessToken;
    const octokit = new MyOctokit({
      auth: accessToken,
    });
    try {
      const { data: repoData } = await octokit.rest.repos.get({
        owner,
        repo,
      });
      const defaultBranch = repoData.default_branch;
      const targetBranch = branch || defaultBranch;
      const branchExists = await checkBranchExists(
        octokit,
        owner,
        repo,
        targetBranch
      );
      if (!branchExists) {
        // Create the branch if it doesn't exist
        await createBranch(octokit, owner, repo, targetBranch, defaultBranch);
      }
      const currentCommit = await getCurrentCommit(
        octokit,
        owner,
        repo,
        targetBranch
      );
      const newFilePath = data.path;
      const newTree = await createNewTree(
        octokit,
        owner,
        repo,
        currentCommit.treeSha,
        newFilePath,
        data.content
      );
      const newCommit = await createNewCommit(
        octokit,
        owner,
        repo,
        message,
        newTree.sha,
        currentCommit.commitSha
      );
      await setBranchToCommit(
        octokit,
        owner,
        repo,
        targetBranch,
        newCommit.sha
      );
      return res.json(successResponse({}, "Successfully pushed workflow"));
    } catch (error) {
      console.log(error);
      return res.json(errorResponse("Failed to push workflow"));
    }
  }
}
const getCurrentCommit = async (
  octo: MyOctokitType,
  org: string,
  repo: string,
  branch: string
) => {
  const { data: refData } = await octo.rest.git.getRef({
    owner: org,
    repo,
    ref: `heads/${branch}`,
  });
  const commitSha = refData.object.sha;
  const { data: commitData } = await octo.rest.git.getCommit({
    owner: org,
    repo,
    commit_sha: commitSha,
  });
  return {
    commitSha,
    treeSha: commitData.tree.sha,
  };
};
const createNewTree = async (
  octo: MyOctokitType,
  owner: string,
  repo: string,
  parentTreeSha: string,
  path: string,
  content: string
) => {
  const {
    data: { sha: blobSha },
  } = await octo.rest.git.createBlob({
    owner,
    repo,
    content,
    encoding: "utf-8",
  });

  const { data } = await octo.rest.git.createTree({
    owner,
    repo,
    tree: [
      {
        path,
        mode: "100644",
        type: "blob",
        sha: blobSha,
      },
    ],
    base_tree: parentTreeSha,
  });
  return data;
};
const createNewCommit = async (
  octo: MyOctokitType,
  org: string,
  repo: string,
  message: string,
  currentTreeSha: string,
  currentCommitSha: string
) =>
  (
    await octo.rest.git.createCommit({
      owner: org,
      repo,
      message,
      tree: currentTreeSha,
      parents: [currentCommitSha],
    })
  ).data;

const setBranchToCommit = async (
  octo: MyOctokitType,
  org: string,
  repo: string,
  branch: string = `master`,
  commitSha: string
) =>
  octo.rest.git.updateRef({
    owner: org,
    repo,
    ref: `heads/${branch}`,
    sha: commitSha,
  });
const checkBranchExists = async (
  octo: MyOctokitType,
  org: string,
  repo: string,
  branch: string
) => {
  try {
    await octo.rest.repos.getBranch({
      owner: org,
      repo,
      branch,
    });
    return true; // Branch exists
  } catch (error: any) {
    if (error.status === 404) {
      return false; // Branch doesn't exist
    }
    throw error; // Other error occurred
  }
};

const createBranch = async (
  octo: MyOctokitType,
  org: string,
  repo: string,
  branch: string,
  baseBranch: string
) => {
  const { data: baseRefData } = await octo.rest.git.getRef({
    owner: org,
    repo,
    ref: `heads/${baseBranch}`,
  });
  const baseCommitSha = baseRefData.object.sha;

  await octo.rest.git.createRef({
    owner: org,
    repo,
    ref: `refs/heads/${branch}`,
    sha: baseCommitSha,
  });
};
