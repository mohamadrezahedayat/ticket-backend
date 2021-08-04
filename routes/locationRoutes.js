const express = require('express');

const locationController = require('../controllers/locationController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(locationController.getAllLocations)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'super-admin'),
    locationController.createLocation
  );

router
  .route('/:id')
  .get(locationController.getLocation)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'super-admin'),
    locationController.updateLocation
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'super-admin'),
    locationController.deleteLocation
  );

module.exports = router;
