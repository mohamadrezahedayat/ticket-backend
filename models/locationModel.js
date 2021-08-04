const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please tell us location name!']
    },
    location: {
      // GeoJason
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number]
    },
    type: { type: String, enum: ['concert', 'club', 'boat'] },
    address: String,
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
    ],
    description: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
locationSchema.virtual('totalCapacity').get(function() {
  return this.capacity.reduce((a, c) => a + c.seats.length, 0);
});
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
