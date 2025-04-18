module.exports = {
    googleAuth: true,
    google: {
      clientID: process.env.GOOGLE_MAILER_CLIENT_ID,
      clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      passReqToCallback: true
    }
  };