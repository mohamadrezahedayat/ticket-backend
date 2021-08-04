const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Event = require('../models/eventModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
// const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) get currently booked event
  const event = await Event.findById(req.params.eventID);
  // 2) create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?event=${
      req.params.eventId
    }&user=${req.user.id}&price=${req.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/event/${event.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.eventID,
    line_items: [
      {
        name: `${event.name} Tour`,
        description: event.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/events/${event.imageCover}`
        ],
        amount: event.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });
  // 3) create session as response
  res.status(200).json({ status: 'success', session });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only temporary and unsecure
  const { event, user, price } = req.query;
  if (!event || !user || !price) return next();

  await Booking.create({ event, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.creatBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
