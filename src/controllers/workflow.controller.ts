import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/responseFormat";
import { Octokit } from "octokit";

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
    const octokit = new Octokit({
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
    const octokit = new Octokit({
      auth: accessToken,
    });
    try {
      const { data: repoData } = await octokit.rest.repos.get({
        owner,
        repo,
      });
      const defaultBranch = repoData.default_branch;
      const targetBranch = branch || defaultBranch;
      // Get the reference of the branch
      const branchRef = await getBranchRef(
        octokit,
        owner,
        repo,
        targetBranch,
        defaultBranch
      );
      // Create a new tree for the file
      const { data: treeData } = await octokit.rest.git.createTree({
        owner,
        repo,
        tree: [
          {
            path: data.path,
            mode: "100644",
            content: data.content,
          },
        ],
        base_tree: branchRef,
      });
      // Create a new commit
      const { data: commitData } = await octokit.rest.git.createCommit({
        owner,
        repo,
        message,
        tree: treeData.sha,
        parents: [branchRef],
      });
      // Update the reference of the branch
      await octokit.rest.git.updateRef({
        owner,
        repo,
        ref: `heads/${targetBranch}`,
        sha: commitData.sha,
      });
      // Push the commit
      await octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${targetBranch}`,
        sha: commitData.sha,
      });
      return res.json(successResponse({}, "Successfully pushed workflow"));
    } catch (error) {
      return res.json(errorResponse("Failed to push workflow"));
    }
  }
}
async function getBranchRef(
  octokit: any,
  owner: string,
  repo: string,
  targetBranch: any,
  defaultBranch: string
) {
  let branchRef;
  try {
    const { data: branchData } = await octokit.request(
      "GET /repos/{owner}/{repo}/git/ref/{ref}",
      {
        owner,
        repo,
        ref: `heads/${targetBranch}`,
      }
    );
    const branchRef = branchData.object.sha;
  } catch (error) {
    const { data: branchData } = await octokit.request(
      "POST /repos/{owner}/{repo}/git/refs",
      {
        owner,
        repo,
        ref: `refs/heads/${targetBranch}`,
        sha: defaultBranch,
      }
    );
    branchRef = branchData.object.sha;
  }
  return branchRef;
}
