const express = require('express');

const artGroupController = require('../controllers/artGroupController');
const authController = require('../controllers/authController');
const imageController = require('../controllers/imageController');

const router = express.Router();

router.route('/').get(artGroupController.getAllArtGroups);

// protects all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .post(
    authController.restrictTo('admin', 'super-admin', 'show-manager'),
    imageController.uploadArtGroupPhotos,
    imageController.resizeArtGroupPhotos,
    artGroupController.createArtGroup
  );

router.use(authController.restrictTo('admin', 'super-admin'));

router
  .route('/:id')
  .get(artGroupController.getArtGroup)
  .patch(
    imageController.uploadArtGroupPhotos,
    imageController.resizeArtGroupPhotos,
    artGroupController.updateArtGroup
  )
  .delete(artGroupController.deleteArtGroup);

module.exports = router;
