const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
// eslint-disable-next-line node/no-unpublished-require
const keys = require('../config/keys');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const photo = profile.photos[0].value;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        done(null, existingUser);
      } else {
        const newUser = await User.collection.insert({
          name,
          email,
          photo,
          role: 'user'
        });
        done(null, newUser);
      }
    }
  )
);
