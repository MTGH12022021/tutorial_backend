const User = require("../model/User.model");

function submitGET(req, res) {
    if (req.isAuthenticated()) {
        res.render('submit');
    } else {
        res.redirect("/login");
    }
}

function submitPOST(req, res) {
    const submittedSecret = req.body.secret;

    User.findById(req.user.id, (err, foundUser) => {
        if (err) { console.log(err); }
        else {
            if (foundUser) {
                foundUser.secret = submittedSecret;
                foundUser.save(function () {
                    res.redirect("/secrets");
                });
            }
        }
    });
}


module.exports = {
    submitGET,
    submitPOST,
}