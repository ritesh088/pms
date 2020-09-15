var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var addNewCatRouter = require('./routes/add-new-category');
var passwordCategoryRouter = require('./routes/passwordCategory');
var addNewPassRouter = require('./routes/add-new-password');
var viewAllPassRouter = require('./routes/view-all-password');
var passwordDetailRouter = require('./routes/password-detail');
var joinRouter = require('./routes/join');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
secret: 'u4TuYF[J~Y>#zd94',
resave: false,
saveUninitialized: true,}));
app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/add-new-category', addNewCatRouter);
app.use('/passwordCategory', passwordCategoryRouter);
app.use('/add-new-password', addNewPassRouter);
app.use('/view-all-password', viewAllPassRouter);
app.use('/password-detail', passwordDetailRouter);
app.use('/joinResult', joinRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;