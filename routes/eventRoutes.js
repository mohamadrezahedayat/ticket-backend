const express = require('express');

const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(eventController.getAllEvents)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'super-admin'),
    eventController.createEvent
  );

router
  .route('/:id/reserveSeat')
  .patch(authController.protect, eventController.reserveSeats);

router
  .route('/:id')
  .get(eventController.getEvent)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'show-manager', 'super-admin'),
    eventController.updateEvent
  )

  .delete(
    authController.protect,
    authController.restrictTo('admin', 'super-admin'),
    eventController.deleteEvent
  );

module.exports = router;
