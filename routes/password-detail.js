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
    

  //for edit oe selected data show on edit form
  router.get('/edit/:id', checkLoginUser, function(req, res, next) {
    //var loginUser = localStorage.getItem('loginUser');
    var loginUser=req.session.userName;
    var id= req.params.id;
    var getPassDetails=passModel.findById({_id:id});
    getPassDetails.exec(function(err,data){
    if (err) throw err;
    getPassCat.exec(function(err,data1){
    res.render('edit_password_detail', { title: 'Password Management System', loginUser:loginUser,records:data1,record:data,success:''});
    });
  });
 });
  //for edit selected data's upated using post route
  router.post('/edit/:id', checkLoginUser, function(req, res, next) {
   // var loginUser = localStorage.getItem('loginUser');
    var loginUser=req.session.userName;
    var id= req.params.id; // ye query string se id get kr rhe
   // var id= req.body.id;// both ate trur // yha form se if get kr rhe req.body.id
    // 3 filed name get here from edit_password_details.ejs page
    var pass_cat= req.body.pass_cat;
    var project_name= req.body.project_name;
    var pass_details= req.body.pass_details;
    passModel.findByIdAndUpdate(id,{password_category:pass_cat,project_name:project_name,password_detail:pass_details}).exec(function(err){
      if (err) throw err;
    var getPassDetails=passModel.findById({_id:id});
    getPassDetails.exec(function(err,data){
    if (err) throw err;
    getPassCat.exec(function(err,data1){
    res.render('edit_password_detail', { title: 'Password Management System', loginUser:loginUser,records:data1,record:data,success:'Data Update Successfully'});
  }) 
  });
  });
  });
//delete view-all-password
router.get('/delete/:id', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var passcat_id=req.params.id;
  //console.log(passcat_id);
 var passdelete= passModel.findByIdAndDelete(passcat_id);
 passdelete.exec(function(err){  
    if(err) throw err;
  res.redirect('/view-all-password'); 

  });
});

    module.exports = router;