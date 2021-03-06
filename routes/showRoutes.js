const express = require('express');

const showController = require('../controllers/showController');
const authController = require('../controllers/authController');
const imageController = require('../controllers/imageController');

const router = express.Router();

router
  .route('/')
  .get(showController.getAllShows)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'super-admin'),
    imageController.uploadShowPhotos,
    imageController.resizeShowPhotos,
    showController.createShow
  );

router
  .route('/:id')
  .get(showController.getShow)
  .patch(
    authController.protect,
    authController.restrictTo('show-manager', 'admin', 'super-admin'),
    imageController.uploadShowPhotos,
    imageController.resizeShowPhotos,
    showController.updateShow
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'super-admin'),
    showController.deleteShow
  );

module.exports = router;
