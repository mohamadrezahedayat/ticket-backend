const mongoose = require('mongoose');
const Location = require('./locationModel');

const eventSchema = new mongoose.Schema(
  {
    show: {
      type: mongoose.Schema.ObjectId,
      ref: 'Show',
      required: [true, 'event must belong to a real show!']
    },
    location: {
      type: mongoose.Schema.ObjectId,
      ref: 'Location',
      required: [
        true,
        'Event location must belong to a real Location!, Please first define location seats in location settings'
      ]
    },
    createdAt: { type: Date, default: Date.now() },
    startDate: { type: Date },
    capacity: [
      {
        type: {
          type: String,
          required: [true, "please define Seat's type."]
        },
        layout: {
          rows: Number,
          columns: Number,
          startRow: Number,
          startColumn: Number
        },
        description: String,
        price: { type: String, default: 0 },
        seats: [
          {
            code: String,
            reserveExpirationTime: Date,
            user: { type: mongoose.Schema.ObjectId, ref: 'User' },
            status: {
              type: String,
              enum: ['inactive', 'reserved', 'free', 'sold', 'hidden', 'in'],
              default: 'free'
            },
            price: { type: String, default: 0 }
          }
        ]
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// clone location.capacity to event.capacity
eventSchema.pre('save', async function(next) {
  const { capacity } = await Location.findById(this.location);
  // deap clone of capacity property of location document
  const capJas = JSON.parse(JSON.stringify(capacity));
  this.capacity = capJas.map(a => ({ ...a }));
  next();
});
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
