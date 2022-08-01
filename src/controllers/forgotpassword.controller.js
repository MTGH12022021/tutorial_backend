const passport = require("passport");
const sendMail = require("./mail.controller")
const User = require("../model/User.model");
const bcrypt = require('bcrypt');
const saltRounds = 10;


// GET "/"
function forgotPasswordGET(req, res) {
    res.render("forgotPassword");
}

// POST "/mail"
function forgotPasswordMailPOST(req, res) {
    const mail = req.body.username;

    User.findOne({ "username": mail }, async (err, user) => {
        if (err) {
            console.log({ err });
        }
        else if (!user) {
            res.redirect("/forgotpassword");
        }
        else {
            bcrypt.hash(user.username, saltRounds).then(async (hashedEmail) => {
                var resp = await sendMail(user.username, `http://localhost:3000/forgotpassword/reset/${user.username}?code=${hashedEmail}`);
                res.redirect(`http://localhost:3000/forgotpassword/reset/${user.username}?code=${hashedEmail}`);
            })
        }
    })
}

// GET /reset/:slug
function forgotPasswordResetGET(req, res) {
    if (!req.params.mail || !req.query.code) {
        res.redirect('/forgotpassword')
    } else {
        bcrypt.compare(req.params.mail, req.query.code, (err, result) => {
            if (err) {
                console.log({ err });
                res.redirect('/forgotpassword');
            }
            else if (!result) {
                console.log("ERROR khong dung mail va code");
                res.redirect('/forgotpassword');
            }
            else {
                res.render('forgotPasswordReset', { mail: req.params.mail })
            }
        })
    }
}

// POST "/reset"
function ResetPOST(req, res) {
    mail = req.body.mail;
    newPassword = req.body.password;

    User.findOne({ "username": mail }, (err, user) => {
        const resp = sendMail(mail);
        user.setPassword(newPassword, (err, user) => {
            if (err) {
                console.log({ err });
            }
            else {
                user.save(function (err) {
                    if (err) {
                        console.log({ err });
                    } else {
                        res.redirect("/login");
                    }
                })
            }
        })

    });
}

// const mail = req.body.username;
// console.log(mail);
// User.findOne({ "username": mail}, (err, user) => {
//     if (err) {
//         console.log({ err });
//     }
//     if (!user) {
//         res.render("forgotPassword", )
//     }
//     else {
//         const resp = sendMail(mail);
//         res.render("forgotPasswordCheckCode");
//         // console.log(user._id);
//         // user.setPassword("987", (err, user) => {
//         //     if (err) {
//         //         console.log({ err });
//         //     }
//         //     else {
//         //         user.save(function (err) {
//         //             if (err) {
//         //                 console.log({ err });
//         //             } else {
//         //                 res.redirect("/login");
//         //            }
//         //         })
//         //     }
//         // })
//     }
// })

module.exports = {
    forgotPasswordGET,
    forgotPasswordMailPOST,
    forgotPasswordResetGET,
    ResetPOST
}