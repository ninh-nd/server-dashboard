import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { PassportStatic } from "passport";
import { IAccount } from "models/interfaces";
import { Account } from "models/account";
import Local from "passport-local";
import Github from "passport-github2";
import { ThirdParty } from "models/thirdParty";
const LocalStrategy = Local.Strategy;
const GithubStrategy = Github.Strategy;
interface IAccountPassport extends Express.User {
  _id?: Types.ObjectId;
}
function initialize(passport: PassportStatic) {
  const authenticateUser = async (
    username: string,
    password: string,
    done: (error: any, user?: any) => void
  ) => {
    const account = await Account.findOne({ username });
    if (account == null) {
      return done(null, false);
    }

    try {
      if (await bcrypt.compare(password, account.password)) {
        return done(null, account);
      }
      return done(null, false);
    } catch (e) {
      return done(e);
    }
  };
  const authenticateUserGithub = async (
    accessToken: string,
    refreshToken: string,
    profile: Github.Profile,
    done: (error: any, user?: any) => void
  ) => {
    try {
      const account = await Account.findOne({ username: profile.id });
      if (!account) {
        const newThirdParty = new ThirdParty({
          name: "Github",
          username: profile.username,
          url: "http://github.com",
        });
        newThirdParty.save((err) => done(err));
        const newAccount = new Account({
          username: profile.id,
          password: profile.id,
          email: profile.emails ? profile.emails[0].value : "",
          thirdParty: [newThirdParty],
        });
        newAccount.save((err, account) => {
          if (err) {
            return done(err);
          }
          return done(null, account);
        });
      }
    } catch (e) {
      return done(e);
    }
  };
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    throw new Error("GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set");
  }
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/auth/github/callback",
      },
      authenticateUserGithub
    )
  );

  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticateUser)
  );
  passport.serializeUser((account: IAccountPassport, done) =>
    done(null, account._id)
  );
  passport.deserializeUser((id: string, done) => {
    Account.findById(id, (err: Error, account: IAccount) => {
      if (err) return done(err);
      return done(null, account);
    });
  });
}

export default initialize;
