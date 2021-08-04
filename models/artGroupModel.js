const mongoose = require('mongoose');

const artGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us Art Group name!'],
    trim: true,
    maxlength: [40, 'A show name must have less or equal then 40 characters'],
    minlength: [3, 'A show name must have more or equal then 3 characters'],
    unique: true
  },
  leader: String,
  images: [String],
  crew: [String],
  description: {
    type: String,
    trim: true
  }
});

const ArtGroup = mongoose.model('ArtGroup', artGroupSchema);

module.exports = ArtGroup;
