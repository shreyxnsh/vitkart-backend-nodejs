const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: '54511394555-9a4t92eh2g850mg7fpfleg8i2b97rkd3.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3001/auth/google/callback', // Adjust the URL as needed
      passReqToCallback: true, // Required for custom request handling
    },
    (request, accessToken, refreshToken, profile, done) => {
      // Check the domain of the user's email address
      const emailDomain = profile.emails[0].value.split('@')[1];
      
      if (emailDomain === 'vitbhopal.ac.in') {
        return done(null, profile);
      } else {
        return done(null, false, { message: 'Unauthorized domain' });
      }
    }
  )
);
