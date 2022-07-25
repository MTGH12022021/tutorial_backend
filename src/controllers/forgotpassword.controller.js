const User = require("../model/User.model");
const passport = require("passport");
const sendMail = require("./mail.controller")

function forgotPasswordGET(req, res) {
    res.render("forgotPassword");
}

function checkcode() {
    
}

function forgotPasswordPOST(req, res) {
    const mail = req.body.username;
    console.log(mail);
    User.findOne({ "username": mail}, (err, user) => {
        if (err) {
            console.log({ err });
        }
        if (!user) {
            res.redirect("/fotgotpassword")
        }
        else {
            const resp = sendMail(mail);
            
            // console.log(user._id);
            // user.setPassword("987", (err, user) => {
            //     if (err) {
            //         console.log({ err });
            //     }
            //     else {
            //         user.save(function (err) {
            //             if (err) {
            //                 console.log({ err });
            //             } else {
            //                 res.redirect("/login");
            //            }
            //         })
            //     }
            // })
        }
    })
}

module.exports = {
    forgotPasswordGET,
    forgotPasswordPOST
}