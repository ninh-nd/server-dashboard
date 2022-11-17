import bcrypt from 'bcrypt';

const LocalStrategy = require('passport-local').Strategy;

function initialize(passport, getAccountByUsername, getAccountById) {
  const authenticateUser = async (username, password, done) => {
    const account = getAccountByUsername(username);
    if (account == null) {
      return done(null, false, { message: 'No user with that username' });
    }

    try {
      if (await bcrypt.compare(password, account.account.password)) {
        return done(null, account);
      }
      return done(null, false, { message: 'Password incorrect' });
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
  passport.serializeUser((account, done) => done(null, account.id));
  passport.deserializeUser((id, done) => done(null, getAccountById(id)));
}

export default initialize;
