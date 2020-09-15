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
    var decoded = jwt.verify(userToken, 'loginToken');
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
    var loginUser = localStorage.getItem('loginUser');
   // if(loginUser){ hide boz use seesion check below
      if(req.session.userName){
      res.redirect('./dashboard')
    }
    else{
    res.render('index', { title: 'Password Management System', msg:'' });
   }
   });


  router.post('/', function(req, res, next) {
    var username = req.body.uname;
    var password = req.body.password;
    var checkUser=userModule.findOne({username:username});//1st username table ka column name h or 2nd wala form se uname ja rha uka variable 
    //var checkPassword=userModule.findOne({password:password});
    checkUser.exec((err,data)=>{// yha data db se aaega jo ki object format hota h , to object se data nikalte h,
      //phle pwd nikala h db se qki usko compare krna h
      if(err) throw err;
      var getUserID=data._id;
      var getPassword=data.password;// db se data get krneka ye tarika hota h, password jo h wo table ka ,
      //column name h, jo password aaega wo encypt h to isme decypt nhi hota h,
      // yha 'compareSync' ka use krte h means ye kaam karta h ki hm jo pwd enter kiye or jo db se password ,
      //get kiye h usko compare krta h means match krta h , islie isme 2 parameter pass krte h,
      //1st jo hm form se pwd enter kr rhe or 2nd jo db se pwd kr rhe h
      //compareSync(password,getPassword)
      if(bcrypt.compareSync(password,getPassword)){//yha jo password ye jo form se password ja rha wo h,
        // getPassword jo h  wo databse se get kr rhe  h,
        //compareSync iska use qki pasword jcrypt m insert krwa rhe h hashSync use krke islie 
        var token = jwt.sign({ userID: getUserID }, 'loginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', username);
        //use of session
        req.session.userName=username; //yha username ko session m store karwa lie 
        res.redirect('/dashboard');
      //res.render('index', { title: 'Password Management System', msg:"User Loggedin Succesfully. password:"+getPassword });
      }
      else{
        res.render('index', { title: 'Password Management System', msg:"Invalid Username & Password." });
      }
    });

    
  });



  




  router.get('/signup', function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    //if(loginUser){
      if(req.session.userName){
      res.redirect('./dashboard')
    }
    else{
    res.render('signup', { title: 'Password Management System', msg:''});  
  }
 });


  router.post('/signup', checkUsername, checkEmail, function(req, res, next) {
        var username=req.body.uname;
        var email=req.body.email;
        var password=req.body.password;
        var confpassword=req.body.confpassword;

      if(password !=confpassword)
      {
        res.render('signup', { title: 'Password Management System', msg:'Paasword not Matched !' });
      }else{
        password = bcrypt.hashSync(req.body.password,10);//pass 2 parameter,1st filedname,2nd length like salt call
        var userDetails=new userModule({
          username:username,
          email:email,
          password:password
        });
        userDetails.save((err,doc)=>{
          if(err) throw err;
          res.render('signup', { title: 'Password Management System', msg:'User Registerd Successfully' });
       });
      }
       //res.render('signup', { title: 'Password Management System' });  
  })


   
//Add new Category

    



   
     
  




  

  router.get('/password-detail', checkLoginUser, function(req, res, next) {
     res.redirect('/dashboard');
  }); 


  


  router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
      if(err)
      {
        res.redirect('/');
      }
    })
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUser');
    res.redirect('/');
  });

  
  router.get('/edit', function(req, res, next) {
    res.render('index', { title: 'Password Management System', msg:'' });
  });

module.exports = router;
//localStorage.setItem('myFirstKey', 'myFirstValue');  for read only 
//console.log(localStorage.getItem('myFirstKey'));
//var jwt = require('jsonwebtoken');
//var token = jwt.sign({ foo: 'bar' }, 'shhhhh');m