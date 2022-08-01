const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const path = require('path');
const findOrCreate = require('mongoose-findorcreate');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const OAuth2Client = require('google-auth-library').OAuth2Client;
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRETCODE,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });



const userSchema = new mongoose.Schema({
    googleId: String,
    username: String,
    password: String,
    
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);
//???
//
const myWorkSpace = new Workspace({});

const gameTransaction = new Transaction({
    name: "Game",
    type: "outcome",
    amount: 100,
    date: new Date(2022, 6, 12)
});

const tuitionTransaction = new Transaction({
    name: "Tuition",
    type: "outcome",
    amount: 200,
    date: new Date(2022, 6, 13)
});

const partimeTransaction = new Transaction({
    name: "Partime",
    type: "income",
    amount: 100,
    date: new Date(2022, 6, 14)
});

myWorkSpace.transactions.push(gameTransaction);
myWorkSpace.transactions.push(tuitionTransaction);
myWorkSpace.transactions.push(partimeTransaction);
//

passport.use(User.createStrategy());
passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((user, done) => { done(null, user); });
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://authenticate-secrets-552.herokuapp.com/auth/google/monesa",
    // callbackURL: "https://localhost:3000/auth/google/monesa",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    (accessToken, refreshToken, profile, done) => {
        User.findOrCreate({ googleId: profile.id, displayName: profile.displayName }, (err, user) => {
            console.log(profile);
            user.defaultWorkspace = new Workspace({
                owner: user.displayName
            });
            user.save();
            return done(err, user);
        });
    }
));

app.listen(process.env.PORT, () => {
    console.log('Server started on port 3000');
});

app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/monesa');
    } else {
        res.render('login.ejs');
    }
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
    });
    res.redirect('/');
});

app.get('/monesa', (req, res) => {
    if (req.isAuthenticated()) {
        User.findOne({ _id: req.user._id }, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                console.log(user);
                res.render('monesa.ejs', { transactions: user.defaultWorkspace.transactions, displayName: user.displayName });
            }
        })
    } else {
        res.redirect('/login');
    }
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/monesa', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/monesa');
});

app.get('/submit', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('submit.ejs');
    } else {
        res.redirect('/login');
    }
});

app.get('/forgot', (req, res) => {
    res.render('forgot.ejs');
});

app.get('/recovery/:id', (req, res) => {
    res.render('recovery.ejs');
});

app.get('/statistic', (req, res) => {
    res.send(getStatistic(myWorkSpace));
});

app.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        displayName: req.body.displayName,
        password: req.body.password
    });

    User.register({ username: newUser.username, displayName: newUser.displayName }, newUser.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect('/register');
        } else {
            user.defaultWorkspace = new Workspace({
                owner: user.username
            });
            user.save();

            console.log('create workspace');

            passport.authenticate('local')(req, res, () => {
                res.redirect('/monesa');
            });
        }
    });
});

app.post('/login', (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/monesa');
        });
    })(req, res, next);
});

app.post('/submit', (req, res) => {
    const userTransaction = new Transaction({
        name: req.body.transactionName,
        type: req.body.transactionType,
        amount: Number(req.body.transactionAmount),
        date: new Date(req.body.transactionDate)
    });

    User.findById(req.user._id, (err, foundUser) => {
        if (err) {
            console.log(err);
            res.redirect('/login');
        } else {
            if (foundUser) {
                if (foundUser.defaultWorkspace.transactions.includes(userTransaction)) {
                    res.redirect('/monesa');
                }
                else {
                    foundUser.defaultWorkspace.transactions.push(userTransaction);
                    foundUser.save();
                    res.redirect('/monesa');
                }
            }
            else {
                res.redirect('/login');
            }
        }
    });
});

app.post('/forgot', (req, res) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'vinhkhangquach2002@gmail.com',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            resfresh_token: process.env.REFRESH_TOKEN,
            accessToken: process.env.ACCESS_TOKEN
        }
    })

    const username = req.body.username;

    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect('/forgot');
        } else {
            if (user) {
                const link = 'https://authenticate-secrets-552.herokuapp.com/recovery/id/' + user._id;
                const mailOptions = {
                    to: user.username,
                    subject: 'Recovery Password',
                    html: "<a href='${link}'>Recover ${user._id}</a>"
                };

                transport.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                        res.redirect('/forgot');
                    } else {
                        console.log(info);
                        res.redirect('/recovery');
                    }
                })
            }
        }
    })
})

app.post('/delete', (req, res) => {
    let deleteID = req.body.deleteTransaction

    User.findById(req.user._id, (err, foundUser) => {
        if (err) {
            console.log(err);
            res.redirect('/monesa');
        } else {
            if (foundUser) {
                foundUser.defaultWorkspace.transactions.splice(deleteID, 1);
                foundUser.save();
                res.redirect('/monesa');
            }
            else {
                res.redirect('/login');
            }
        }
    })
});