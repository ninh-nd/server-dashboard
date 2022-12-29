import express from 'express'
import passport from 'passport'
import {
  get, create, changePassword, addThirdPartyToAccount, returnSession, logout
} from 'controllers/auth/account.controller'
import { checkAuth } from 'middlewares/auth'

const router = express.Router()

// Login
router.post('/login', passport.authenticate('local'), returnSession)
// Logout
router.get('/logout', logout)
// Get an account
router.get('/', checkAuth, get)
// Create an account
router.post('/reg', create)
// Add a third party to an account
router.patch('/:id/thirdParty', addThirdPartyToAccount)
// Change password
router.patch('/:id/password', changePassword)

export default router
