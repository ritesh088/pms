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

    router.get('/', function(req, res, next) {
       // var loginUser = localStorage.getItem('loginUser');
        var loginUser=req.session.userName;
        getPassCat.exec(function(err,data){
          if (err) throw err;
          res.render('add-new-password', { title: 'Password Management System ncvknnv', loginUser:loginUser,records:data,success:''});
        })
         
      })
    
      router.post('/', function(req, res, next) {
       // var loginUser = localStorage.getItem('loginUser');
        var loginUser=req.session.userName;
        var pass_cat = req.body.pass_cat;
        var project_name = req.body.project_name;
        var pass_details = req.body.pass_details;
        
        var password_details = new passModel({
          password_category : pass_cat,
          project_name : project_name,
          password_detail : pass_details
        });
    
       // getPassCat.exec(function(err,data){
         // if (err) throw err;
          password_details.save(function(err,data){
            getPassCat.exec(function(err,data){
              if (err) throw err;
            res.render('add-new-password', { title: 'Password Management System ncvknnv', loginUser:loginUser,records:data, success:'data insert successfully' });
    
          })
          //res.render('add-new-password', { title: 'Password Management System ncvknnv', loginUser:loginUser,records:data });
        })
         
      })
    
    

  

    module.exports = router;