const Event = require('../models/eventModel');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.getAllEvents = factory.getAll(
  Event,
  {
    path: 'location',
    select: '-description -location -show -__v -address'
  },
  { path: 'show', select: '_id name artGroup manager' }
);
exports.getEvent = factory.getOne(Event);
exports.createEvent = factory.createOne(Event);
exports.deleteEvent = factory.deleteOne(Event);
exports.updateEvent = factory.updateOne(Event);
