// todo quan ly cookie
const session = require('express-session')      // dung de luu truu cookie https://www.npmjs.com/package/express-session
//https://anonystick.com/blog-developer/vi-du-ve-nodejs-session-su-dung-express-session-2019110742210630
const passport = require("passport");

// todo module dung de quan ly soucre code
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");

const router = require("./routes/index")

//todo cau hinh cua db
const db = require("./config/db/index");

// todo cau hinh server
let PORT = process.env.PORT;
const app = express();

//todo server use
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.set("views", path.join(__dirname, "views"));

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
db.connect();
const User = require("./model/User.model")

//Configure Passport / Passport - Local
const connetPassport = require("./config/passport/index");
connetPassport(passport)

//todo cac luong thu thi
router(app);

//todo server listen
if (PORT == null || PORT == "") {
    PORT = 3000;
}

app.listen(PORT, function () {
    console.log("Server has started successfully");
});
