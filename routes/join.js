var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var bcrypt =require('bcryptjs');
var jwt=require('jsonwebtoken');
var passCatModel=require('../modules/password_category');
const { check, validationResult } = require('express-validator');

var getPassCat= passCatModel.find({});

var passModel=require('../modules/add_password');
var getAllPass= passModel.find({});



/* GET home page. */



//create function for checkuserlogin middleware
function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    //use session here
    if(req.session.userName){
    var decoded = jwt.verify(userToken, 'loginToken');
    }else{
      res.redirect('/');
    }
  } catch(err) {
    res.redirect('/');
  }
  next();
}

//localstorage  ko require kiye h yha
if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

   //create middle ware for check email exit or not
    function checkEmail(req,res,next){
      var email=req.body.email;
      var checkexitemail=userModule.findOne({email:email});
      checkexitemail.exec((err,data)=>{
      if (err) throw err;
      if(data){
      return res.render('signup', { title: 'Password Management System', msg:'Email Already Exit !'}); 
      }
      next(); 
      });

    }

    //create middle ware for check username exit or not
    function checkUsername(req,res,next){
      var uname=req.body.uname;
      var checkusernameemail=userModule.findOne({username:uname});
      checkusernameemail.exec((err,data)=>{
      if (err) throw err;
      if(data){
      return res.render('signup', { title: 'Password Management System', msg:'UserName Already Exit !'}); 
      }
      next(); 
      });

    }

    //pagignation using npm install mongoose-paginate
  router.get('/', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
passModel.aggregate([
    {
      $lookup:
        {
          from: "password_categories",
          localField: "password_category",
          foreignField: "passord_category",
          as: "pass_cat_details"
        }
   },
   { $unwind: "$pass_cat_details" }
 ]).exec(function(err,result){
     if (err) throw err;
     console.log(result);
     res.send(result);
 })
  }); 
  
 module.exports = router;