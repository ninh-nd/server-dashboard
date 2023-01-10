import { Octokit } from 'octokit'
import { Account } from 'models/account'
import { ActivityHistory } from 'models/activityHistory'
import { Member } from 'models/member'
import { GithubConfig } from 'models/githubConfig'
import { Project } from 'models/project'
import { errorResponse, successResponse } from 'utils/responseFormat'
import { DEFAULT_TTL, redisClient } from 'redisServer'
import { Request, Response } from 'express'
import { Types } from 'mongoose'
async function getGithubPull(owner: string, repo: string, accessToken: string, projectId: Types.ObjectId) {
  const cache = await redisClient.v4.get(`github-pr-${repo}`)
  if (cache) {
    return true
  }
  const octokit = new Octokit({
    auth: accessToken
  })
  let prData
  try {
    prData = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'all'
    })
  } catch (error) {
    return new Error("Error retrieving PRs from Github API")
  }
  await redisClient.v4.setEx(`github-pr-${repo}`, DEFAULT_TTL, JSON.stringify(prData))
  const processedPrData = prData.data.map(({
    id, title: content, created_at: createdAt, user
  }) => {
    const createdBy = user?.login;
    return ({
      id, action: 'pr', content, createdAt, createdBy, projectId
    })
  })
  try {
    await ActivityHistory.insertMany(
      [...processedPrData],
      { ordered: false }
    )
    // Add history to each member in the project
    const history = await ActivityHistory.find({ projectId })
    const members = await Member.find({ projectIn: projectId })
    members.forEach(async (member) => {
      // Temporary solution as Github is the only third party
      const account = await Account.findById(member.account)
      if (account == null) {
        return new Error("Can't find account")
      }
      const thirdPartyUsername = account.thirdParty[0].username
      const memberHistory = history.filter(
        ({ createdBy }) => createdBy === thirdPartyUsername
      )
      await Member.findByIdAndUpdate(
        member._id,
        { $addToSet: { activityHistory: memberHistory } },
        { new: true }
      )
    })
    return true
  } catch (error) {
    return new Error("Error retrieving PRs from Github API")
  }
}

async function getGithubCommits(owner: string, repo: string, accessToken: string, projectId: Types.ObjectId) {
  const cache = await redisClient.v4.get(`github-commit-${repo}`)
  if (cache) {
    return true
  }
  const octokit = new Octokit({
    auth: accessToken
  })
  let commitData
  try {
    commitData = await octokit.rest.repos.listCommits({
      owner,
      repo
    })
  } catch (error) {
    return new Error("Error retrieving PRs from Github API")
  }
  await redisClient.v4.setEx(`github-commit-${repo}`, DEFAULT_TTL, JSON.stringify(commitData))
  const processedCommitData = commitData.data.map(({ sha: id, commit }) => {
    const content = commit.message
    const createdBy = commit.author?.name
    const createdAt = commit.author?.date
    return ({ id, action: 'commit', content, createdAt, createdBy, projectId })
  })
  try {
    await ActivityHistory.insertMany(
      [...processedCommitData],
      { ordered: false }
    )
    // Add history to each member in the project
    const history = await ActivityHistory.find({ projectId })
    const members = await Member.find({ projectIn: projectId })
    members.forEach(async (member) => {
      // Temporary solution as Github is the only third party
      const account = await Account.findById(member.account)
      if (account == null) {
        return new Error("Can't find account")
      }
      const thirdPartyUsername = account.thirdParty[0].username
      const memberHistory = history.filter(
        ({ createdBy }) => createdBy === thirdPartyUsername
      )
      await Member.findByIdAndUpdate(
        member._id,
        { $addToSet: { activityHistory: memberHistory } },
        { new: true }
      )
    })
    return true
  } catch (error) {
    return new Error("Error retrieving commits from Github API")
  }
}

async function getPRs(req: Request, res: Response) {
  const { projectName } = req.params
  const githubConfig = await GithubConfig.findOne({ repo: projectName })
  if (githubConfig == null) {
    return res.json(errorResponse('No github config found'))
  }
  const {
    accessToken, owner, repo, projectId
  } = githubConfig
  const result = await getGithubPull(owner, repo, accessToken, projectId)
  if (result instanceof Error) {
    return res.json(errorResponse(`Error retrieving PRs: ${result.message}`))
  }
  try {
    const prs = await ActivityHistory.find({ projectId, action: 'pr' })
    const total = prs.length
    const authorArray = prs.map((pr) => pr.createdBy)
    const uniqueAuthors = [...new Set(authorArray)]
    const individualContribution: Array<{ author: string, total: number }> = []
    uniqueAuthors.forEach((author) => {
      const prOfAnAuthor = prs.filter((pr) => pr.createdBy === author)
      const totalOfAnAuthor = prOfAnAuthor.length
      if (author) {
        individualContribution.push({ author, total: totalOfAnAuthor })
      }
    })
    const data = { total, contribution: individualContribution }
    return res.json(successResponse(data, 'Successfully retrieved PRs'))
  } catch (error) {
    return res.json(errorResponse('Error retrieving PRs'))
  }
}

async function getCommits(req: Request, res: Response) {
  const { projectName } = req.params
  const githubConfig = await GithubConfig.findOne({ repo: projectName })
  if (githubConfig == null) {
    return res.json(errorResponse('No github config found'))
  }
  const {
    accessToken, owner, repo, projectId
  } = githubConfig
  const result = await getGithubCommits(owner, repo, accessToken, projectId)
  if (result instanceof Error) {
    return res.json(errorResponse(`Error retrieving commits: ${result.message}`))
  }
  try {
    const commits = await ActivityHistory.find({ projectId, action: 'commit' })
    const total = commits.length
    const authorArray = commits.map((cm) => cm.createdBy)
    const uniqueAuthors = [...new Set(authorArray)]
    const individualContribution: Array<{ author: string, total: number }> = []
    uniqueAuthors.forEach((author) => {
      const prOfAnAuthor = commits.filter((cm) => cm.createdBy === author)
      const totalOfAnAuthor = prOfAnAuthor.length
      if (author) {
        individualContribution.push({ author, total: totalOfAnAuthor })
      }
    })
    const data = { total, contribution: individualContribution }
    return res.json(successResponse(data, 'Successfully retrieved commits'))
  } catch (error) {
    return res.json(errorResponse('Error retrieving commits'))
  }
}

async function getCommitsByAccount(req: Request, res: Response) {
  const { username, projectName } = req.params
  try {
    const projectId = await Project.findOne({ name: projectName })
    if (projectId == null) {
      return res.json(errorResponse('No project found'))
    }
    const user = await Account.findOne({ username })
    if (user == null) {
      return res.json(errorResponse('No user found'))
    }
    // Get the account linked to the internal account
    const commits = await ActivityHistory.find({ createdBy: user.thirdParty[0].username, action: 'commit', projectId })
    const result = { total: commits.length, commits }
    return res.json(successResponse(result, 'Successfully retrieved commits'))
  } catch (error) {
    return res.json(errorResponse('Error retrieving commits'))
  }
}

async function getPRsByAccount(req: Request, res: Response) {
  const { username, projectName } = req.params
  try {
    const projectId = await Project.findOne({ name: projectName })
    if (projectId == null) {
      return res.json(errorResponse('No project found'))
    }
    const user = await Account.findOne({ username })
    if (user == null) {
      return res.json(errorResponse('No user found'))
    }
    // Get the account linked to the internal account
    const prs = await ActivityHistory.find({ createdBy: user.thirdParty[0].username, action: 'pr', projectId })
    const result = { total: prs.length, prs }
    return res.json(successResponse(result, 'Successfully retrieved PRs'))
  } catch (error) {
    return res.json(errorResponse('Error retrieving PRs'))
  }
}

export {
  getPRs,
  getCommits,
  getCommitsByAccount,
  getPRsByAccount
}
