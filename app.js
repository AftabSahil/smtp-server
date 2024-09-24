const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, function(token, tokenSecret, profile, done) {
  // Save the user to the database or find existing
  // Use Prisma to manage user
  return done(null, profile);
}));
