require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = mongoose.Schema({
    email:String,
    password:String,
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);

app.get("/", (req,res)=>{
    res.render("home");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

// app.get("/logout", function(req, res){
//   req.logout();
//   res.redirect("/");
// });

app.post("/register",(req,res)=>{
   const newUser = new User({
       email:req.body.username,
       password:req.body.password,
   });
   newUser.save(err =>{
    if(err){
        console.log(err);
    } else{
        res.render("secrets");
    }
   }); 
});

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username},(err,foundUser)=>{
        if(err){
            console.log(err);
        } else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});