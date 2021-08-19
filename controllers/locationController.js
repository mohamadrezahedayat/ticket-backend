const Location = require('../models/locationModel');
const factory = require('./handlerFactory');

exports.getAllLocations = factory.getAll(Location);
exports.getLocation = factory.getOne(Location);
exports.createLocation = factory.createOne(Location);
exports.deleteLocation = factory.deleteOne(Location);
exports.updateLocation = factory.updateOne(Location);
exports.parsLocation = (req, res, next) => {
  if (!req.body.location) return next();

  req.body.location = JSON.parse(req.body.location);
  next();
};
exports.parsCapacity = (req, res, next) => {
  if (!req.body.capacity) return next();

  req.body.capacity = JSON.parse(req.body.capacity);
  next();
};
