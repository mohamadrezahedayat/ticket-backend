const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: [true, 'Booking must belong to a seat!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user!']
  },
  seatCode: { type: String, required: true },
  barcode: { type: String },
  price: { type: Number, required: [true, 'Booking must have a price!'] },
  paidAmount: {
    type: Number,
    required: [true, 'Booking must have a paid amount!']
  },
  currency: {
    type: String,
    enum: ['USD', 'TRY', 'IRR', 'TRX', 'USDT'],
    default: 'USD'
  },
  transactionNumber: { type: String },
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now() },
  paid: {
    type: Boolean,
    default: true
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
