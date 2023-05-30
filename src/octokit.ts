import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
const MyOctokit = Octokit.plugin(paginateRest, restEndpointMethods);
const newOctokit = new MyOctokit();
export type MyOctokitType = typeof newOctokit;
export default MyOctokit;
