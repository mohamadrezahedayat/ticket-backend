const Event = require('../models/eventModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllEvents = factory.getAll(
  Event,
  {
    path: 'location',
    select: '-description -show -__v -address'
  },
  {
    path: 'show',
    select: '_id name artGroup manager images imageCover',
    populate: {
      path: 'artGroup',
      select: 'name images '
    }
  }
);

exports.getEvent = factory.getOne(
  Event,
  {
    path: 'location',
    select: '-description -show -__v -address'
  },
  {
    path: 'show',
    select: '_id name artGroup manager images imageCover',
    populate: {
      path: 'artGroup',
      select: 'name images '
    }
  }
);

exports.createEvent = factory.createOne(Event);
exports.deleteEvent = factory.deleteOne(Event);
exports.updateEvent = factory.updateOne(Event);

exports.parsCapacity = (req, res, next) => {
  if (!req.body.capacity) return next();

  req.body.capacity = JSON.parse(req.body.capacity);
  next();
};

exports.unreserveSeats = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  const result = await Event.findById(req.params.id).select('capacity');
  const { capacity } = result;

  capacity.forEach(zone => {
    zone.seats.forEach(seat => {
      if (
        seat.status === 'reserved' &&
        (!seat.reserveExpirationTime || seat.reserveExpirationTime < Date.now())
      ) {
        seat.status = 'free';
        seat.user = null;
        seat.reserveExpirationTime = null;
      }
      if (seat.user === userId) {
        seat.status = 'free';
        seat.reserveExpirationTime = null;
        seat.user = null;
      }
    });
  });

  const result2 = await Event.findByIdAndUpdate(
    req.params.id,
    { capacity },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: result2
    }
  });
});

exports.reserveSeats = catchAsync(async (req, res, next) => {
  const { selectedSeats, duration, userId } = req.body;
  const result = await Event.findById(req.params.id).select('capacity');
  const { capacity } = result;

  capacity.forEach(zone => {
    zone.seats.forEach(seat => {
      if (selectedSeats.includes(seat.code)) {
        if (
          seat.status === 'reserved' &&
          seat.reserveExpirationTime &&
          new Date(seat.reserveExpirationTime) > Date.now() + 60 * 1000 &&
          seat.user !== userId
        )
          return next(
            new AppError(
              `Seat by code ${seat.code} reserved by another person, Please select new seats`,
              404
            )
          );
        seat.status = 'reserved';
        seat.reserveExpirationTime = Date.now() + duration;
        seat.user = userId;
      } else if (userId === `${seat.user}`) {
        seat.status = 'free';
      }
    });
  });
  const result2 = await Event.findByIdAndUpdate(
    req.params.id,
    { capacity },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      data: result2
    }
  });
});
