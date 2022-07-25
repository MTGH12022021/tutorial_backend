
function homeController(req, res) {
    res.render("home")
}

function secretController(req, res) {
    if (req.isAuthenticated()) {
        res.render('secrets', { userWithSecret: req.user });
    } else {
        res.redirect("/login");
    }
}

function logoutController(req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}

module.exports = {
    homeController,
    secretController, 
    logoutController
};