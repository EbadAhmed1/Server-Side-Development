var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/conFusion';

// Connect to MongoDB
mongoose.connect(url)
  .then(() => {
    console.log('Connected successfully to MongoDB server');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321')); // Secret for signed cookies
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
function auth(req, res, next) {
  console.log(req.signedCookies);

  if (!req.signedCookies.user) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const username = auth[0];
    const password = auth[1];

    if (username === 'admin' && password === 'password') {
      res.cookie('user', 'admin', { signed: true, httpOnly: true });
      return next();
    } else {
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  } else {
    if (req.signedCookies.user === 'admin') {
      return next();
    } else {
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  }
}

// Apply authentication to protected routes only
app.use('/dishes', auth, dishRouter);
app.use('/promotions', auth, promoRouter);
app.use('/leaders', auth, leaderRouter);

// Public routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;