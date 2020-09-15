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

    router.get('/', checkLoginUser, function(req, res, next) {
        //var loginUser = localStorage.getItem('loginUser');
        var loginUser=req.session.userName;
      res.render('addNewCategory', { title: 'Password Management System',loginUser:loginUser,errors:'',success:'' });
  
    });
  
  
  
    router.post('/', checkLoginUser,
    // [check('passwordCategory','Please enter 8 character and contain one uppercase, one lowercase, one special character, one digit').isLength({ min: 1 }).matches( /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]{8,}$/,
   // )],function(req, res, next) {
  
      [check('passwordCategory','Please enter Category Name').isLength({ min: 1 })],function(req, res, next) {
  
     //var loginUser = localStorage.getItem('loginUser');
     var loginUser=req.session.userName;
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       // console.log(errors.mapped());
        res.render('addNewCategory', { title: 'Password Management System',loginUser:loginUser, errors:errors.mapped(),success:'' });
     
      }else{
        var passCatName =req.body.passwordCategory;
        var passCatDetails =new passCatModel({
        passord_category: passCatName 
        });
  
        passCatDetails.save(function(err,doc){
          if(err) throw err;
          res.render('addNewCategory', { title: 'Password Management System',loginUser:loginUser,errors:'',success:"Password Category Data Inserted Successfuly" });
  
        });
       
      }
       
      
     });
  

    module.exports = router;