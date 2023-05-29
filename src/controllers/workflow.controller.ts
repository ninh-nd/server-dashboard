import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/responseFormat";
import { Octokit } from "octokit";

export async function getYaml(req: Request, res: Response) {
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
