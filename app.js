//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt=require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localHost:27017/userDB");

const userschema=new mongoose.Schema ({
  email:String,
  pasword:String
});

//var secret = "Thisisourlittelescret.";
userschema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['pasword'] });

const User=new mongoose.model("User",userschema);

app.get ("/",function(req,res){
  res.render("home");
});

app.get ("/login",function(req,res){
  res.render("login");
});

app.get ("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser=new User ({
    email:req.body.username,
    pasword:req.body.password
  });
  newUser.save(function(err)
  {
if (err) {
  console.log(err);
} else {
  res.render("secrets");
  }
})
});

app.post ("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;
// console.log(username);
// console.log(password);
  User.findOne({email: username},function(err,foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        //console.log(foundUser);
        if (foundUser.pasword === password) {
          res.render("secrets");
        }
      }
    }
  });
});


//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
