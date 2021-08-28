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
  { path: 'show', select: '_id name artGroup manager images' }
);
exports.getEvent = factory.getOne(Event);
exports.createEvent = factory.createOne(Event);
exports.deleteEvent = factory.deleteOne(Event);
exports.updateEvent = factory.updateOne(Event);

exports.parsCapacity = (req, res, next) => {
  if (!req.body.capacity) return next();

  req.body.capacity = JSON.parse(req.body.capacity);
  next();
};
