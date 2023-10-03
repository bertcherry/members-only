const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/user');
const user_controller = require('./controllers/userController');
const message_controller = require('./controllers/messageController');

mongoose.set('strictQuery', false);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.DEV_DATABASE), { useUnifiedTopology: true, useNewUrlParser: true };
}

passport.use(
  new LocalStrategy(async (email, password, done) => {
    const user = await UserActivation.findOne({ email: email });
    if (!user) {
      return done(null, false, { message: 'No user matches that email.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: 'Incorrect password' });
    }
    if (err) {
      return done(err);
    }
    return done(null, user);
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  }
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Members Only' });
});

app.get('/sign-up', user_controller.user_create_get);
app.post('/sign-up', user_controller.user_create_post);

app.get('/login', function(req, res, next) {
  res.render('login_form', { title: 'Log In' });
});
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/'
}));

app.get('/messages/create', message_controller.message_create_get);
app.post('/messages/create', message_controller.message_create_post);

app.post('/messages/:id/delete', message_controller.message_delete_post);

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

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