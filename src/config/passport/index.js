const User = require("../../model/User.model")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config({
    path: './src/.env'
})

module.exports = (passport) => {
    passport.use(User.createStrategy());

    passport.serializeUser(function (user, done) {      // ma hoa
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {      // giai ma
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/secrets",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
        function (accessToken, refreshToken, profile, cb) {
            //console.log(profile);
            User.findOrCreate({ googleId: profile.id }, function (err, user) {
                return cb(err, user);
            });
        }
    ));
}