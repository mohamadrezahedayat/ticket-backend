// const Booking = require('../models/bookingModel');
// const Tour = require('../models/tourModel');
// const User = require('../models/userModel');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');

// exports.getOverview = catchAsync(async (req, res, next) => {
//   // 1) Get tour data from collection
//   const tours = await Tour.find();
//   // 2) build template
//   // 3) render that template using tour data from 1)
//   res.status(200).render('overview', { title: 'All Tours', tours });
// });

// exports.getTour = async (req, res, next) => {
//   // 1) Get the data for the requested tour(including reviews and guides)
//   const tour = await Tour.findOne({ slug: req.params.slug }).populate({
//     path: 'reviews',
//     fields: 'review rating user'
//   });

//   if (!tour) {
//     return next(new AppError('There is no tour with that name', 404));
//   }
//   // 2) Build template
//   // 3) Render template using dat from 1)
//   res
//     .status(200)
//     .render('tour', { tour, title: `Natours | ${req.params.slug}` });
//   // .set(
//   //   'Content-Security-Policy',
//   //   "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
//   // )
// };

// exports.getLoginForm = (req, res) => {
//   res.status(200).render('login', { title: 'Log into your acount' });
// };

// exports.getAccount = (req, res) => {
//   res.status(200).render('account', { title: 'Your account' });
// };

// exports.getMyTours = catchAsync(async (req, res, next) => {
//   // 1) find all bookings
//   const bookings = await Booking.find({ user: req.user.id });
//   // 2) find tours with the returned IDs
//   const tourIDs = bookings.map(el => el.tour);
//   const tours = await Tour.find({ _id: { $in: tourIDs } });

//   res.status(200).render('overview', { title: 'My tours', tours });
// });

// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email
//     },
//     { new: true, runValidators: true }
//   );
//   res
//     .status(200)
//     .render('account', { title: 'Your account', user: updatedUser });
// });
