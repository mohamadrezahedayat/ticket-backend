const express = require('express');
const { passportGoogleAuth } = require('../utils/passport');

const router = express.Router();

/**
 * example: http://ticket.com/auth/google
 */
router.get(
  '/google',
  passportGoogleAuth.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passportGoogleAuth.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_BASE_URL}/auth`,
    successRedirect: `${process.env.CLIENT_BASE_URL}/account`
  })
);

router.get('/google/logout', (req, res, next) => {
  req.logout();

  res.status(200).json({
    status: 'success'
  });
});

router.get('/current_user', (req, res) => {
  res.send(req.user);
});

module.exports = router;
