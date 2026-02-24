let passport;
let GoogleStrategy;

try {
  passport = require('passport');
  GoogleStrategy = require('passport-google-oauth20').Strategy;

  const User = require('../models/users');

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          return done(null, { profile, accessToken, refreshToken });
        } catch (err) {
          return done(err);
        }
      }
    )
  );
} catch (e) {
  console.warn('Passport or Google Strategy not found. Google login/linking features will be disabled.');
}

module.exports = passport || {
  initialize: () => (req, res, next) => next(),
  authenticate: () => (req, res, next) => next(),
  isMock: true
};
