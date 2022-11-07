import { Octokit } from 'octokit';
import { Account } from '../../models/account.js';
import { ActivityHistory } from '../../models/activityHistory.js';
import { Member } from '../../models/member.js';
import { GithubConfig } from '../../models/githubConfig.js';
import { Project } from '../../models/project.js';
import { errorResponse, successResponse } from '../../utils/responseFormat.js';

async function getLatestGithubActivity(owner, repo, accessToken, projectId) {
  const octokit = new Octokit({
    auth: accessToken,
  });
  let prData = [];
  let commitData = [];
  try {
    prData = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'all',
    });
  } catch (error) {
    return new Error(error);
  }
  const processedPrData = prData.data.map(({
    id, title: content, created_at: createdAt, user: { login: createdBy },
  }) => ({
    id, action: 'pr', content, createdAt, createdBy, projectId,
  }));
  try {
    commitData = await octokit.rest.repos.listCommits({
      owner,
      repo,
    });
  } catch (error) {
    return new Error(error);
  }
  const processedCommitData = commitData.data.map(({
    sha: id, commit:
    { message: content, author: { name: createdBy, date: createdAt } },
  }) => ({
    id, action: 'commit', content, createdAt, createdBy, projectId,
  }));
  try {
    await ActivityHistory.insertMany(
      [...processedPrData, ...processedCommitData],
      { ordered: false },
    );
    // Add history to each member in the project
    const history = await ActivityHistory.find({ projectId });
    const members = await Member.find({ projectIn: projectId });
    members.forEach(async (member) => {
      // Temporary solution as Github is the only third party
      const account = await Account.findById(member.account);
      const thirdPartyUsername = account.thirdParty[0].username;
      const memberHistory = history.filter(
        ({ createdBy }) => createdBy === thirdPartyUsername,
      );
      await Member.findByIdAndUpdate(
        member._id,
        { $addToSet: { activityHistory: memberHistory } },
        { new: true },
      );
    });
    return true;
  } catch (err) {
    return false;
  }
}

async function getPRs(req, res) {
  const { projectName } = req.params;
  const githubConfig = await GithubConfig.findOne({ name: projectName }).populate('projectId');
  if (!githubConfig) {
    return res.status(404).json(errorResponse('No github config found'));
  }
  const {
    accessToken, owner, repo, projectId,
  } = githubConfig;
  const result = await getLatestGithubActivity(owner, repo, accessToken, projectId);
  if (result instanceof Error) {
    return res.json(errorResponse(`Error retrieving PRs: ${result.message}`));
  }
  try {
    const prs = await ActivityHistory.find({ projectId, action: 'pr' });
    const total = prs.length;
    const authorArray = prs.map((pr) => pr.createdBy);
    const uniqueAuthors = [...new Set(authorArray)];
    const individualContribution = [];
    uniqueAuthors.forEach((author) => {
      const prOfAnAuthor = prs.filter((pr) => pr.createdBy === author);
      const totalOfAnAuthor = prOfAnAuthor.length;
      individualContribution.push({ author, total: totalOfAnAuthor });
    });
    const data = { total, contribution: individualContribution };
    return res.status(200).json(successResponse(data, 'Successfully retrieved PRs'));
  } catch (error) {
    return res.json(errorResponse('Error retrieving PRs'));
  }
}

async function getCommits(req, res) {
  const { projectName } = req.params;
  const githubConfig = await GithubConfig.findOne({ name: projectName }).populate('projectId');
  if (!githubConfig) {
    return res.status(404).json(errorResponse('No github config found'));
  }
  const {
    accessToken, owner, repo, projectId,
  } = githubConfig;
  const result = await getLatestGithubActivity(owner, repo, accessToken, projectId);
  if (result instanceof Error) {
    return res.json(errorResponse(`Error retrieving commits: ${result.message}`));
  }
  try {
    const commits = await ActivityHistory.find({ projectId, action: 'commit' });
    const total = commits.length;
    const authorArray = commits.map((cm) => cm.createdBy);
    const uniqueAuthors = [...new Set(authorArray)];
    const individualContribution = [];
    uniqueAuthors.forEach((author) => {
      const prOfAnAuthor = commits.filter((cm) => cm.createdBy === author);
      const totalOfAnAuthor = prOfAnAuthor.length;
      individualContribution.push({ author, total: totalOfAnAuthor });
    });
    const data = { total, contribution: individualContribution };
    return res.status(200).json(successResponse(data, 'Successfully retrieved commits'));
  } catch (error) {
    return res.json(errorResponse('Error retrieving commits'));
  }
}

async function getCommitsByAccount(req, res) {
  const { username, projectName } = req.params;
  try {
    const projectId = await Project.findOne({ name: projectName });
    if (!projectId) {
      return res.status(404).json(errorResponse('No project found'));
    }
    const user = await Account.findOne({ username });
    if (!user) {
      return res.status(404).json(errorResponse('No user found'));
    }
    // Get the account linked to the internal account
    const commits = await ActivityHistory.find({ createdBy: user.thirdParty[0].username, action: 'commit', projectId });
    const result = { total: commits.length, commits };
    return res.status(200).json(successResponse(result, 'Successfully retrieved commits'));
  } catch (error) {
    return res.json(errorResponse('Error retrieving commits'));
  }
}

async function getPRsByAccount(req, res) {
  const { username, projectName } = req.params;
  try {
    const projectId = await Project.findOne({ name: projectName });
    if (!projectId) {
      return res.status(404).json(errorResponse('No project found'));
    }
    const user = await Account.findOne({ username });
    if (!user) {
      return res.status(404).json(errorResponse('No user found'));
    }
    // Get the account linked to the internal account
    const prs = await ActivityHistory.find({ createdBy: user.thirdParty[0].username, action: 'pr', projectId });
    const result = { total: prs.length, prs };
    return res.status(200).json(successResponse(result, 'Successfully retrieved PRs'));
  } catch (error) {
    return res.json(errorResponse('Error retrieving PRs'));
  }
}

export {
  getPRs,
  getCommits,
  getCommitsByAccount,
  getPRsByAccount,
};
