import express from 'express';
import accountController from '../controller/accountController.js';

const router = express.Router();

// Get an account
router.get('/:id', accountController.getAccount);
// Create an account
router.post('/reg', accountController.createAccount);
// Login
router.post('/login', accountController.login);
// Get refresh token
// router.post('/token', accountController.getRefreshToken);
// Add a third party to an account
router.patch('/:id/thirdParty', accountController.addThirdParty);
// Change password
router.patch('/:id/password', accountController.changePassword);
// Delete an account
router.delete('/:id', accountController.deleteAccount);
export default router;
