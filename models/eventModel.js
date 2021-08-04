const mongoose = require('mongoose');
const Location = require('./locationModel');

const eventSchema = new mongoose.Schema(
  {
    show: {
      type: mongoose.Schema.ObjectId,
      ref: 'Show',
      required: [true, 'Booking must belong to a show!']
    },
    location: {
      type: mongoose.Schema.ObjectId,
      ref: 'Location',
      required: [true, 'Booking must belong to a location!']
    },
    createdAt: { type: Date, default: Date.now() },
    startDate: { type: Date },
    capacity: [
      {
        type: {
          type: String,
          required: [true, "please define Seat's type."]
        },
        description: String,
        price: { type: String, default: 0 },
        seats: [
          {
            code: String,
            status: {
              type: String,
              enum: ['inactive', 'reserved', 'free', 'sold'],
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
