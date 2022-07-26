import { Octokit } from 'octokit';
import { Account } from '../../models/account.js';
import { ActivityHistory } from '../../models/activityHistory.js';
import { Member } from '../../models/member.js';

const activityController = {
  populatePRsAndCommits: async (req, res) => {
    const {
      owner, repo, accessToken, projectId,
    } = req.body;
    const octokit = new Octokit({
      auth: accessToken,
    });
    const prData = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'all',
    });
    const prs = prData.data.map(({
      id, title: content, created_at: createdAt, user: { login: createdBy },
    }) => ({
      id, action: 'pr', content, createdAt, createdBy, projectId,
    }));
    const commitData = await octokit.rest.repos.listCommits({
      owner,
      repo
    });
    const commits = commitData.data.map(({
      sha: id, commit:
      { message: content, author: { name: createdBy, date: createdAt } },
    }) => ({
      id, action: 'commit', content, createdAt, createdBy, projectId,
    }));
    try {
      await ActivityHistory.insertMany([...prs, ...commits], {
        ordered: false,
      }); // Set ordered to false to insert any document that is not duplicated
      return res.status(201).send({ message: 'Successfully populated PRs and commits' });
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
  addHistory: async (req, res) => {
    const { projectId } = req.body;
    try {
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
      return res.status(201).send({ message: 'Successfully added history' });
    } catch (error) {
      return res.json({ error });
    }
  },
};

export default activityController;
