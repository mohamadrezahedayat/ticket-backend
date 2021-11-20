const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
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

exports.passportGoogleAuth = passport.use(
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

/**
 * jwt sterategy
 */

exports.passportJwt = passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (user) return done(null, user);
        return done(null, false);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
