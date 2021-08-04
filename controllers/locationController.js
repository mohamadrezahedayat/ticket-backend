const Location = require('../models/locationModel');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.getAllLocations = factory.getAll(Location);
exports.getLocation = factory.getOne(Location);
exports.createLocation = factory.createOne(Location);
exports.deleteLocation = factory.deleteOne(Location);
exports.updateLocation = factory.updateOne(Location);
