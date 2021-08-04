const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: [true, 'Booking must belong to a seat!']
  },
  zone: { type: String, required: true },
  seatCode: { type: String, required: true },
  barcode: { type: String, required: [true, 'Booking must have a barcode!'] },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user!']
  },
  price: { type: Number, required: [true, 'Booking must have a price!'] },
  createdAt: { type: Date, default: Date.now() },
  paid: {
    type: Boolean,
    default: true
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
