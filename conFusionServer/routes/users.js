const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      passport.authenticate('local')(req, res, () => {
        req.login(user, (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              error: 'Login after registration failed'
            });
          }
          return res.status(200).json({
            success: true,
            status: 'Registration Successful'
          });
        });
      });
    }
  );
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        status: 'Login Unsuccessful',
        error: info.message
      });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        success: true,
        status: 'Login Successful'
      });
    });
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('session-id');
      res.status(200).json({
        success: true,
        status: 'Logged out successfully'
      });
    });
  });
});

module.exports = router;