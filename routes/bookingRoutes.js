const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');

const router = express.Router();

router.use(authController.protect);

router.get(
  '/myTickets',
  bookingController.aliasMyTicket,
  bookingController.getAllBookings
);
// router.get('/checkout-session/:eventID', bookingController.getCheckoutSession);

// router.use(authController.restrictTo('admin', 'super-admin', 'manager'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking, eventController.ChangeSeatsToSold);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
