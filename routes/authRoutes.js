const express = require('express');
const passportGoogleAuth = require('../utils/passport');

const router = express.Router();

// for loggin
router.get(
  '/google',
  passportGoogleAuth.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', passportGoogleAuth.authenticate('google'));

router.get('/google/logout', (req, res, next) => {
  req.logout();
  next();
});
module.exports = router;
