import bcrypt from 'bcrypt'
import { Types } from 'mongoose'
import { PassportStatic } from 'passport'
import { IAccount } from 'models/interfaces'
import { Account } from 'models/account'
const LocalStrategy = require('passport-local').Strategy
interface IAccountPassport extends Express.User {
  _id?: Types.ObjectId;
}
function initialize(passport: PassportStatic) {
  const authenticateUser = async (username: string, password: string, done: Function) => {
    const account = await Account.findOne({ username })
    if (account == null) {
      return done(null, false)
    }

    try {
      if (await bcrypt.compare(password, account.password)) {
        return done(null, account)
      }
      return done(null, false)
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  passport.serializeUser((account: IAccountPassport, done) => done(null, account._id))
  passport.deserializeUser((id: string, done) => {
    Account.findById(id, (err: Error, account: IAccount) => {
      if (err) return done(err)
      return done(null, account)
    })
  })
}

export default initialize
