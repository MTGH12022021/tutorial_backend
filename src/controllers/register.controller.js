const passport = require("passport");
const User = require("../model/User.model");

function registerGET(req, res) {
    res.render("register");
}

function registerPOST(req, res) {
    //module passport-local-monogo cung cap cho chung ta ham dang nhap su dung truc tiep bien User tu mongo
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
}

module.exports = {
    registerGET,
    registerPOST
};