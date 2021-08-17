const express = require('express');
const imageController = require('../controllers/imageController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/signup',
  imageController.uploadUserPhoto,
  imageController.resizeUserPhoto,
  authController.signup
);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// protects all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  imageController.uploadUserPhoto,
  imageController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

// restricts all routes to only 'admin' after this middleware
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(
    imageController.uploadUserPhoto,
    imageController.resizeUserPhoto,
    userController.updateUser
  )
  .delete(userController.deleteUser);

module.exports = router;
