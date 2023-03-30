import "dotenv/config";
import bcrypt from "bcrypt";
import { Account } from "models/account";
import { successResponse, errorResponse } from "utils/responseFormat";
import { Request, Response } from "express";
import { ThirdParty } from "models/thirdParty";
import { IAccount } from "models/interfaces";

export async function get(req: Request, res: Response) {
  try {
    const account = req.user as IAccount;
    const findedAccount = await Account.findById(account._id);
    return res.json(successResponse(findedAccount, "Account found"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function create(req: Request, res: Response) {
  const { username, password, email } = req.body;
  // Check if account exists
  const accountExists = await Account.findOne({ username });
  if (accountExists != null) {
    return res.json(errorResponse("Username already exists"));
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create account
  try {
    const newAccount = new Account({
      username,
      password: hashedPassword,
      email,
    });
    await newAccount.save();
    return res.json(successResponse(newAccount, "Account created"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function addThirdPartyToAccount(req: Request, res: Response) {
  // Check if account exists
  const { id } = req.params;
  const account = await Account.findById(id);
  if (account == null) {
    return res.json(errorResponse("Account not found"));
  }
  // Add third party account to account
  try {
    const { name, username, url } = req.body;
    const newThirdParty = new ThirdParty({
      name,
      username,
      url,
    });
    account.thirdParty.push(newThirdParty);
    await account.save();
    return res.json(successResponse(account, "Third party account added"));
  } catch (error) {
    return res.json(errorResponse(`Internal server error: ${error}`));
  }
}

export async function changePassword(req: Request, res: Response) {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.json(errorResponse("Missing old or new password"));
  }
  // Check if account exists
  const account = await Account.findById(id);
  if (account == null) {
    return res.json(errorResponse("Account not found"));
  }
  // Check if old password is correct
  const isMatch = await bcrypt.compare(oldPassword, account.password);
  if (!isMatch) {
    return res.json(errorResponse("Incorrect old password"));
  }
  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  // Change password
  account.password = hashedPassword;
  await account.save();
  return res.json(successResponse(account, "Password changed"));
}
