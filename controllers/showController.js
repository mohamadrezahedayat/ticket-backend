const Show = require('../models/showModel');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.getAllShows = factory.getAll(
  Show,
  {
    path: 'artGroup',
    select: 'name'
  },
  {
    path: 'manager',
    select: 'name'
  }
);
exports.getShow = factory.getOne(Show);
exports.createShow = factory.createOne(Show);
exports.deleteShow = factory.deleteOne(Show);
exports.updateShow = factory.updateOne(Show);
