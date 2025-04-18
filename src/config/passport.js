const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');
var secrets = require('./secret');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
 });

 passport.use(new GoogleStrategy(secrets.google, async function(req, accessToken, refreshToken, profile, done) {
    try {
        let user = await User.findOne({ username: profile.emails[0].value });

        if (!user) {
            user = new User({
                username: profile.emails[0].value,
                password: 'oauth', // Không cần password
                role: 'customer'
            });
            await user.save();
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return done(null, { user, token });
    } catch (error) {
        return done(error, null);
    }
  }));

module.exports = passport;
