const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  seat: {
    type: mongoose.Schema.ObjectId,
    ref: 'Seat',
    required: [true, 'Booking must belong to a seat!']
  },
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
