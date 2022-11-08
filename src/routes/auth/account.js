import express from 'express';
import {
  get, create, login, changePassword, addThirdPartyToAccount,
} from '../../controllers/auth/account.controller.js';

const router = express.Router();

// Get an account
router.get('/:id', get);
// Create an account
router.post('/reg', create);
// Login
router.post('/login', login);
// Get refresh token
// router.post('/token', accountController.getRefreshToken);
// Add a third party to an account
router.patch('/:id/thirdParty', addThirdPartyToAccount);
// Change password
router.patch('/:id/password', changePassword);
export default router;
