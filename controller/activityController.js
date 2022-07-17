import { Octokit } from 'octokit';
import { Account } from '../models/account.js';
import { ActivityHistory } from '../models/activityHistory.js';

const activityController = {
  addPRs: async (req, res) => {
    const {
      owner, repo, accessToken, projectId,
    } = req.body;
    const octokit = new Octokit({
      auth: accessToken,
    });
    const data = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'all',
    });
    const prs = data.data.map(({
      id, title: content, created_at: createdAt, user: { login: createdBy },
    }) => ({
      id, action: 'pr', content, createdAt, createdBy, projectId,
    }));
    try {
      await ActivityHistory.insertMany(prs, {
        ordered: false,
      }); // Set ordered to false to insert any document that is not duplicated
      return res.status(200).send(prs);
    } catch (error) {
      return res.json({ error });
    }
  },
  addCommits: async (req, res) => {
    const {
      owner, repo, accessToken, projectId,
    } = req.body;
    const octokit = new Octokit({
      auth: accessToken,
    });
    const data = await octokit.rest.repos.listCommits({
      owner,
      repo,
    });
    const commits = data.data.map(({
      sha: id, commit:
      { message: content, author: { name: createdBy, date: createdAt } },
    }) => ({
      id, action: 'commit', content, createdAt, createdBy, projectId,
    }));
    try {
      await ActivityHistory.insertMany(commits, {
        ordered: false,
      }); // Set ordered to false to insert any document that is not duplicated
      return res.status(200).send(commits);
    } catch (error) {
      return res.json({ error });
    }
  },
  getPRs: async (req, res) => {
    const { projectId } = req.query;
    try {
      const prs = await ActivityHistory.find({ projectId, action: 'pr' });
      return res.status(200).send(prs);
    } catch (error) {
      return res.json({ error });
    }
  },
  getCommits: async (req, res) => {
    const { projectId } = req.query;
    try {
      const commits = await ActivityHistory.find({ projectId, action: 'commit' });
      return res.status(200).send(commits);
    } catch (error) {
      return res.json({ error });
    }
  },
  getCommitsByAccount: async (req, res) => {
    const { id } = req.params;
    try {
      // Get the internal account from id
      const user = await Account.findById(id);
      // Get the account linked to the internal account
      const commits = await ActivityHistory.find({ createdBy: user.thirdParty[0].username, action: 'commit' });
      console.log(user.thirdParty[0].username);
      return res.status(200).send(commits);
    } catch (error) {
      return res.json({ error });
    }
  },
  getPRsByAccount: async (req, res) => {
    const { id } = req.params;
    try {
      // Get the internal account from id
      const user = await Account.findById(id);
      // Get the account linked to the internal account
      const prs = await ActivityHistory.find({ createdBy: user.thirdParty[0].username, action: 'pr' });
      return res.status(200).send(prs);
    } catch (error) {
      return res.json({ error });
    }
  },
};

export default activityController;
