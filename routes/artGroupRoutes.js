const express = require('express');

const artGroupController = require('../controllers/artGroupController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(artGroupController.getAllArtGroups)
  .post(artGroupController.createArtGroup);

router
  .route('/:id')
  .get(artGroupController.getArtGroup)
  .patch(
    authController.protect,
    authController.restrictTo('show-manager', 'admin', 'super-admin'),
    artGroupController.updateArtGroup
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'super-admin'),
    artGroupController.deleteArtGroup
  );

module.exports = router;
