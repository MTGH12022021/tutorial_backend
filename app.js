// todo module dung de bao mat
require('dotenv').config()  //bien moi truong https://www.npmjs.com/package/dotenv
const encrypt = require("mongoose-encryption"); //Cap2   dung de ma hoa https://www.npmjs.com/package/mongoose-encryption
const md5 = require("md5");  //Cap 3   ham bam dung de bao mat https://www.npmjs.com/package/md5 
const bcrypt = require('bcrypt');      //Cap 4   ham dung de salt + hashing

// todo module dung de quan ly soucre code
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path")


const PORT = 3000;
const saltRounds = 10;
const app = express();

//todo server use
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//todo database
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

mongoose.connect("mongodb+srv://admin-Loi:Han12022021@cluster0.cdpzsch.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });

//!!! khong can vi co bao mat md5
// const encrypt_key = process.env.ENCRYT_KEY;
// userSchema.plugin(encrypt, { secret: encrypt_key, encryptedFields: ['password'] });

const User = new mongoose.model("test", userSchema);


//todo home
app.get('/', (req, res) => {
  res.render("home")
});


//todo login
app.get('/login', (req, res) => {
  res.render("login");
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  // const password = md5(req.body.password);
  const password = req.body.password;

  User.findOne({ email: username }, (err, foundUser) => {
    if (err)
      console.log(err);
    else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          // result == true
          if (result == true) {
            res.render("secrets");
          }
        });
      }
    }
  });
});


//todo register
app.get('/register', (req, res) => {
  res.render("register");
});

app.post('/register', (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      // password: md5(req.body.password)
      password: hash
    });
    newUser.save((err) => {
      if (err)
        console.log(err);
      else {
        res.render("secrets");
      }
    });
  });

});



//todo server listen
app.listen(PORT, function () {
  console.log("Server started on port 3000.");
});
