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
   // var loginUser = localStorage.getItem('loginUser');
    var loginUser=req.session.userName;
   // for pagignation
   var options = {
    offset:   1, 
    limit:    3
};
passModel.paginate({}, options).then(function(result) { //yha .paginate m 2 params jaega query means {}for all data
          console.log(result); //isme apko pura dta show hoga in aray format, isme docs ke ander h sab offset,limt ye sab
      
       res.render('view-all-password', { title: 'Password Management System', 
       loginUser:loginUser,
       records:result.docs,
       current: result.offset, //yha hm offset uper difine kiye h waha se v le sakte h buy hm result se offset le rhe h
       pages: Math.ceil(result.total / result.limit)
       });
  }); 
  }); 
  

  //for pagignation dynamic page get in url
  router.get('/:page', checkLoginUser, function(req, res, next) {
   // var loginUser = localStorage.getItem('loginUser');
    var loginUser=req.session.userName;
   // for pagignation
      var perPage = 3;
      var page = req.params.page || 1;
      //getAllPass.exec(function(err,data){
        getAllPass.skip((perPage * page) - perPage)
        .limit(perPage).exec(function(err,data){
          
      if (err) throw err;

      passModel.countDocuments({}).exec((err,count)=>{   
       res.render('view-all-password', { title: 'Password Management System', 
       loginUser:loginUser,
       records:data,
       current: page,
       pages: Math.ceil(count / perPage)
       });
    }); 
  }); 
  });

  /*comment this pagination code , this is hard code without package ,hard code

  router.get('/', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');

   // for pagignation
      var perPage = 3;
      var page = req.params.page || 1;
      //getAllPass.exec(function(err,data){
        getAllPass.skip((perPage * page) - perPage)
        .limit(perPage).exec(function(err,data){
          
      if (err) throw err;

      passModel.countDocuments({}).exec((err,count)=>{   
       res.render('view-all-password', { title: 'Password Management System', 
       loginUser:loginUser,
       records:data,
       current: page,
       pages: Math.ceil(count / perPage)
       });
    }); 
  }); 
  }); 
  

  //for pagignation dynamic page get in url
  router.get('/:page', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');

   // for pagignation
      var perPage = 3;
      var page = req.params.page || 1;
      //getAllPass.exec(function(err,data){
        getAllPass.skip((perPage * page) - perPage)
        .limit(perPage).exec(function(err,data){
          
      if (err) throw err;

      passModel.countDocuments({}).exec((err,count)=>{   
       res.render('view-all-password', { title: 'Password Management System', 
       loginUser:loginUser,
       records:data,
       current: page,
       pages: Math.ceil(count / perPage)
       });
    }); 
  }); 
  });
  */

    


    module.exports = router;