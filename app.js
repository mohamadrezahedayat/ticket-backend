const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
const xss = require('xss-clean');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
// const formData = require('express-form-data');
// const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const globalErrorHandler = require('./controllers/errorController');
// const authController = require('./controllers/authController');
// eslint-disable-next-line node/no-unpublished-require
const keys = require('./config/keys');
const artGroupRouter = require('./routes/artGroupRoutes');
const locationRouter = require('./routes/locationRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const reviewRouter = require('./routes/reviewRoutes');
// const viewRouter = require('./routes/viewRoutes');
const eventRouter = require('./routes/eventRoutes');
const userRouter = require('./routes/userRoutes');
const showRouter = require('./routes/showRoutes');
const authRouter = require('./routes/authRoutes');
const AppError = require('./utils/appError');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
app.use(cors());
app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));

// SET SECURITY HTTP HEADERS
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       useDefaults: true,
//       directives: {
//         'script-src': [
//           "'self'",
//           'https://cdnjs.cloudflare.com',
//           'https://api.mapbox.com',
//           'blob:'
//         ],
//         'default-src': ["'self'", 'https://*.mapbox.com']
//       }
//     }
//   })
// );
// app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// LIMIT REQUESTS FROM SAME API
// todo activate this
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many request from this ip, Please try again in an Hour!'
// });
// app.use('/api', limiter);

app.use(express.json({ limit: '50kb' }));

app.use(express.urlencoded({ extended: true, limit: '50kb' }));

app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

// PREVENT PARAMETER PULLOTION
// todo: edit parameters
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// app.use(formData.parse());
app.use(compression());

// passport sterategy
app.use(cookieSession({ maxAge: 24 * 3600 * 1000, keys: [keys.cookieKey] }));
app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
// console.log('passport', passport);
//   console.log('req._passport:', req._passport);
//   next();
// });

// 3) ROUTES
app.use('/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/shows', showRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/locations', locationRouter);
app.use('/api/v1/artGroups', artGroupRouter);
// // template route for debuging perpuses
// app.get('/passport', authController.protect, (req, res) => {
//   res.send(req.user);
// });
// for react page
app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
