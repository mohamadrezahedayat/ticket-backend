const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A show must have a name'],
      trim: true,
      minlength: [4, 'A show name must have more or equal then 4 characters'],
      maxlength: [40, 'A show name must have less or equal then 40 characters']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A show must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    dates: [Date],
    artGroup: {
      type: mongoose.Schema.ObjectId,
      ref: 'ArtGroup',
      required: [true, 'each show must belong to a art group!']
    },
    manager: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
  }
  // ,
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true }
  // }
);

const Show = mongoose.model('Show', showSchema);

module.exports = Show;
