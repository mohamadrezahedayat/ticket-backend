const ArtGroup = require('../models/artGroupModel');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.getAllArtGroups = factory.getAll(ArtGroup);
exports.getArtGroup = factory.getOne(ArtGroup);
exports.createArtGroup = factory.createOne(ArtGroup);
exports.deleteArtGroup = factory.deleteOne(ArtGroup);
exports.updateArtGroup = factory.updateOne(ArtGroup);
