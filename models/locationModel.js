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
    address: { type: String, trim: true },
    description: { type: String, trim: true },
    capacity: [
      {
        type: {
          type: String,
          required: [true, "please define Seat's type."]
        },
        price: { type: String, default: 0 },
        seats: [
          {
            code: String,
            status: {
              type: String,
              enum: ['inactive', 'reserved', 'free', 'sold', 'in'],
              default: 'free'
            },
            price: { type: String, default: 0 }
          }
        ]
      }
    ],
    images: [String]
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
