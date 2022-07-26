require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
mongoose.pluralize(null);

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.use(express.static(__dirname +"/public"));

mongoose.connect("mongodb://localhost:27017/secretDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



userSchema.plugin(encrypt, {secret:process.env.SECRETKEY, encryptedFields:['password']});

const Users = new mongoose.model("Users",userSchema);  



app.listen(3000, function(req,res)
{

    console.log("Server started successfully");
});


app.get("/", function(req,res)
{
    res.render("home");
})

//Route for Login Page
app.route("/login").get( function(req,res)
{
    res.render("login");
})

.post(function(req,res)
{
    let userEmail = req.body.username;
    let userPass = req.body.password;

    Users.findOne({email:userEmail}, function(err,foundUser)
    {
      if(foundUser)
       {
        if(foundUser.password === userPass)
        {
            res.render("secrets");
        }
       }
    
      else
      {
        res.send("Your login credentials are incorrect. Please try again")
      }


    })

    
})

// Route for Register Page
app.route("/register").get( function(req,res)
{
   res.render("register");
})

.post(function(req,res)
{
    let userEmail = req.body.username;
    let userPass = req.body.password;

    const newUser = new Users({
        email: userEmail,
        password: userPass
    })

    newUser.save(function(err)
    {
      if(err)
      res.send(err);
      else
      res.render("secrets"); 
    })
})