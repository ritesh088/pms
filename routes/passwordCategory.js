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

    //View All Category
   router.get('/', function(req, res, next) {
   // var loginUser = localStorage.getItem('loginUser');
    var loginUser=req.session.userName;
    getPassCat.exec(function(err,data){  
      if(err) throw err;
    res.render('password_category', { title: 'Password Management System', loginUser:loginUser,records:data }); 

    });
 });

//Delete passwordCategory

router.get('/delete/:id', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var passcat_id=req.params.id;
  //console.log(passcat_id);
 var passdelete= passCatModel.findByIdAndDelete(passcat_id);
 passdelete.exec(function(err){  
    if(err) throw err;
  res.redirect('/passwordCategory'); 

  });
});

//Update passwordCategory get edit id and fetch existing data

router.get('/edit/:id', function(req, res, next) {
  //var loginUser = localStorage.getItem('loginUser');
  var loginUser=req.session.userName;
  var passcat_id=req.params.id;
  var getpassCategory= passCatModel.findById(passcat_id);
  getpassCategory.exec(function(err,data){  
    if(err) throw err;
    //console.log(data);
    res.render('edit_pass_category', { title: 'Password Management System', loginUser:loginUser,errors:'',success:'',records:data,id:passcat_id }); 

  });
});

//Update passwordCategory post edit form with fecting data ko edir krke save krnaor redirect krke updated data show
router.post('/edit/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  var passcat_id=req.body.id; // ye wala form se get kr rhe jo hidden field m h, body se le rhe na ki params se
  var passwordCategory=req.body.passwordCategory; 
  var update_passCat= passCatModel.findByIdAndUpdate(passcat_id,{passord_category:passwordCategory});
  //yha 'passcat_id' m edit wala id get kiye fr '{passord_category:passwordCategory}',passord_category ye column
  //ka naam h schema ka means table or isme pass kiye h 'passwordCategory' varibale jisme update wala data milega
  update_passCat.exec(function(err,doc){  
    if(err) throw err; 
    
    //console.log(data);
    //res.render('edit_pass_category', { title: 'Password Management System', loginUser:loginUser,errors:'',success:'',records:data,id:passcat_id }); 
     res.redirect('/passwordCategory');
  });
});

  

    module.exports = router;