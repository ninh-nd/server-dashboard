import express from 'express'
import passport from 'passport'
import {
  get, create, changePassword, addThirdPartyToAccount
} from '../../controllers/auth/account.controller'

const router = express.Router()

// Get an account
router.get('/:id', get)
// Create an account
router.post('/reg', create)
// Login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))
// Add a third party to an account
router.patch('/:id/thirdParty', addThirdPartyToAccount)
// Change password
router.patch('/:id/password', changePassword)
export default router
