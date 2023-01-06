import 'dotenv/config'
import bcrypt from 'bcrypt'
import { Account } from 'models/account'
import { successResponse, errorResponse } from 'utils/responseFormat'
import { Request, Response } from 'express'
import { ThirdParty } from 'models/thirdParty'
import { IAccount } from 'models/interfaces'

async function get(req: Request, res: Response) {
  try {
    const account = req.user as IAccount
    const findedAccount = await Account.findById(account._id)
    return res.status(200).json(successResponse(findedAccount, 'Account found'))
  } catch (error) {
    return res.status(500).json(errorResponse(`Internal server error: ${error}`))
  }
}

async function create(req: Request, res: Response) {
  const { username, password, email } = req.body
  // Check if account exists
  const accountExists = await Account.findOne({ username })
  if (accountExists != null) {
    return res.status(409).json(errorResponse('Username already exists'))
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)
  // Create account
  try {
    const newAccount = new Account({
      username,
      password: hashedPassword,
      email
    })
    await newAccount.save()
    return res.status(201).json(successResponse(newAccount, 'Account created'))
  } catch (error) {
    return res.status(500).json(errorResponse(`Internal server error: ${error}`))
  }
}

async function addThirdPartyToAccount(req: Request, res: Response) {
  // Check if account exists
  const account = await Account.findById(req.params.id)
  if (account == null) {
    return res.status(404).json(errorResponse('Account not found'))
  }
  // Add third party account to account
  try {
    const { name, username, url } = req.body
    const newThirdParty = new ThirdParty({
      name,
      username,
      url
    })
    account.thirdParty.push(newThirdParty)
    await account.save()
    return res.status(200).json(successResponse(account, 'Third party account added'))
  } catch (error) {
    return res.status(500).json(errorResponse(`Internal server error: ${error}`))
  }
}

async function changePassword(req: Request, res: Response) {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    return res.status(400).json(errorResponse('Missing old or new password'))
  }
  // Check if account exists
  const account = await Account.findById(req.params.id)
  if (account == null) {
    return res.status(404).json(errorResponse('Account not found'))
  }
  // Check if old password is correct
  const isMatch = await bcrypt.compare(oldPassword, account.password)
  if (!isMatch) {
    return res.status(400).json(errorResponse('Incorrect old password'))
  }
  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  // Change password
  account.password = hashedPassword
  await account.save()
  return res.status(200).json(successResponse(account, 'Password changed'))
}

async function returnSession(req: Request, res: Response) {
  const sid = req.session.id
  return res.status(200).json(successResponse({ sid }, 'New session created'))
}

async function logout(req: Request, res: Response) {
  req.logout((err) => {
    if (err) {
      return res.status(500).json(errorResponse(err))
    }
  })
  return res.status(200).json(successResponse(null, 'Logged out'))
}

export {
  get, create, addThirdPartyToAccount, changePassword, returnSession, logout
}
