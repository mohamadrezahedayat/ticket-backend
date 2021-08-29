const express = require('express');

const artGroupController = require('../controllers/artGroupController');
const authController = require('../controllers/authController');
const imageController = require('../controllers/imageController');

const router = express.Router();

router.route('/').get(artGroupController.getAllArtGroups);

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'super-admin', 'show-manager'),
    imageController.uploadArtGroupPhotos,
    imageController.resizeArtGroupPhotos,
    artGroupController.createArtGroup
  );

router
  .route('/:id')
  .get(artGroupController.getArtGroup)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'super-admin'),
    imageController.uploadArtGroupPhotos,
    imageController.resizeArtGroupPhotos,
    artGroupController.updateArtGroup
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'super-admin'),
    artGroupController.deleteArtGroup
  );

module.exports = router;
