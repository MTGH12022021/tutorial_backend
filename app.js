// todo quan ly cookie
require('dotenv').config()
const session = require('express-session')      // dung de luu truu cookie https://www.npmjs.com/package/express-session
//https://anonystick.com/blog-developer/vi-du-ve-nodejs-session-su-dung-express-session-2019110742210630
const passport = require("passport");
const passportLocalMongo = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");      // cung cap ham findorcreat vi trong mongoose ko co ham do

// todo module dung de quan ly soucre code
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path")

let PORT = process.env.PORT;
const app = express();

//todo server use
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({           // tao goi session cho may chu trang web
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());     // khoi tao 
app.use(passport.session());        // yeu cau he thong su dung passport de dua session vao 


//todo database
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongo);   // them plugin nay vo de co the giup salt va hashing ket hop voi cookie
userSchema.plugin(findOrCreate);

mongoose.connect(process.env.MONGOATLAS, {
  useNewUrlParser: true
});

const User = new mongoose.model("test", userSchema);

//Configure Passport / Passport - Local
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
  callbackURL: "https://shrouded-plateau-90742.herokuapp.com/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
  function (accessToken, refreshToken, profile, cb) {
    //console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

//todo home
app.get('/', (req, res) => {
  res.render("home")
});

//todo secrets
app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render('secrets', { userWithSecret: req.user });
  } else {
    res.redirect("/login");
  }
});

// todo logout
app.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//todo login
app.get('/login', (req, res) => {
  res.render("login");
});


//https://www.geeksforgeeks.org/when-to-use-next-and-return-next-in-node-js/#:~:text=In%20this%20is%20article%20we,next()%20will%20be%20unreachable.
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
      return res.redirect('/secrets');
    });
  })(req, res, next);
});

//todo login with google
app.get('/auth/google',
  passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });

//todo register
app.get('/register', (req, res) => {
  res.render("register");
});

app.post('/register', (req, res) => {

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
});

//todo submit
app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render('submit');
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", (req, res) => {
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
})

//todo server listen
if (PORT == null || PORT == "") {
  PORT = 3000;
}

app.listen(PORT, function () {
  console.log("Server has started successfully");
});
