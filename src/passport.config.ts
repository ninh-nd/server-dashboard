import bcrypt from "bcrypt";
import { AccountModel, ThirdPartyModel } from "./models/models";
import { PassportStatic } from "passport";
import Github from "passport-github2";
import Local from "passport-local";
const LocalStrategy = Local.Strategy;
const GithubStrategy = Github.Strategy;
function initialize(passport: PassportStatic) {
  const authenticateUser = async (
    username: string,
    password: string,
    done: (error: any, user?: any) => void
  ) => {
    try {
      const account = await AccountModel.findOne({ username });
      if (!account) {
        return done(null, false);
      }
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
      // Check if there is an account that has already linked to this Github account
      const linkedAccount = await AccountModel.findOne({
        "thirdParty.username": profile.username,
        "thirdParty.name": "Github",
      });
      if (linkedAccount) {
        return done(null, linkedAccount);
      }
      const account = await AccountModel.findOne({
        username: `Github_${profile.username}`,
      });
      // First time login
      if (!account) {
        const newThirdParty = await ThirdPartyModel.create({
          name: "Github",
          username: profile.username,
          url: "http://github.com",
          accessToken,
        });
        const newAccount = await AccountModel.create({
          username: `Github_${profile.username}`,
          password: profile.id,
          email: profile.emails ? profile.emails[0].value : "",
          thirdParty: [newThirdParty],
        });
        return done(null, newAccount);
      }
      await ThirdPartyModel.findOneAndUpdate(
        { username: profile.username },
        { accessToken }
      );
      return done(null, account);
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
        callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
      },
      authenticateUserGithub
    )
  );

  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticateUser)
  );
  passport.serializeUser((account, done) => done(null, account._id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const results = await AccountModel.findById(id);
      if (results) {
        return done(null, results);
      }
    } catch (error) {
      return done(error);
    }
  });
}

export default initialize;
