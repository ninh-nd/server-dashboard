import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Account } from '../models/account.js';
import { ThirdParty } from '../models/thirdParty.js';
import { Member } from '../models/member.js';
import { ProjectManager } from '../models/projectManager.js';

function generateAccessToken(username) {
  return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
}
async function getRole(accountId) {
  const member = await Member.findOne({ account: accountId });
  const projectManager = await ProjectManager.findOne({ account: accountId });
  if (member) {
    return {
      role: 'member',
      id: member._id,
    };
  }
  if (projectManager) {
    return {
      role: 'projectManager',
      id: projectManager._id,
    };
  }
  return null;
}

const accountController = {
  getAccount: async (req, res) => {
    try {
      const account = await Account.findById(req.params.id);
      return res.status(200).json(account);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  createAccount: async (req, res) => {
    const { username, password, email } = req.body;
    // Check if account exists
    const accountExists = await Account.findOne({ username });
    if (accountExists) {
      return res.status(400).json({
        message: 'Account already exists',
      });
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
      return res.status(201).json(newAccount);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(400).json({
        message: 'Username not found',
      });
    }
    try {
      const { _id: accountId } = account;
      const result = await bcrypt.compare(password, account.password);
      if (result) {
        const accessToken = generateAccessToken(accountId);
        const refreshToken = jwt.sign({ accountId }, process.env.REFRESH_TOKEN_SECRET);
        const roleObject = await getRole(accountId);
        const { role, id } = roleObject;
        return res.status(200).json({
          role,
          id,
          username,
          accessToken,
          refreshToken,
        });
      }
      return res.status(401).json({
        message: 'Incorrect password',
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  deleteAccount: async (req, res) => {
    Account.findByIdAndDelete(req.params.id, (err, doc) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (!doc) {
        return res.status(404).json({
          message: 'Account not found',
        });
      }
      return res.status(200).json({
        message: 'Account deleted',
      });
    });
  },
  addThirdParty: async (req, res) => {
    // Check if account exists
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({
        message: 'Account not found',
      });
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
      return res.status(200).json(account);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  changePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }
    // Check if account exists
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({
        message: 'Account not found',
      });
    }
    // Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, account.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Incorrect password',
      });
    }
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Change password
    account.password = hashedPassword;
    await account.save();
    return res.status(200).json(account);
  },
};
export default accountController;
