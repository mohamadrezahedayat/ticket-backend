const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    const resource = req.baseUrl.split('/')[3];

    switch (resource) {
      case 'artgroups':
        doc.images.forEach(image => {
          fs.unlink(`./public/img/artists/${image}`, err => {
            console.log(err);
          });
        });
        break;

      case 'shows':
        doc.images.forEach(image => {
          fs.unlink(`./public/img/shows/${image}`, err => {
            console.log(err);
          });
        });
        fs.unlink(`./public/img/shows/${doc.imageCover}`, err => {
          console.log(err);
        });
        break;
      case 'locations':
        doc.images.forEach(image => {
          fs.unlink(`./public/img/locations/${image}`, err => {
            console.log(err);
          });
        });
        break;
      default:
        break;
    }
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    try {
      const doc = await Model.create(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          data: doc
        }
      });
    } catch (error) {
      return next(new AppError(error, 400));
    }
  });

exports.getOne = (Model, pop1, pop2, pop3) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    query = query
      .populate(pop1)
      .populate(pop2)
      .populate(pop3);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = (Model, pop1, pop2, pop3) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .like()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query
      .populate(pop1)
      .populate(pop2)
      .populate(pop3);
    // const docs = await features.query.explain();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });
