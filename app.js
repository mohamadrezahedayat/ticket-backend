const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const artGroupRouter = require('./routes/artGroupRoutes');
const userRouter = require('./routes/userRoutes');
const showRouter = require('./routes/showRoutes');
const locationRouter = require('./routes/locationRoutes');
const eventRouter = require('./routes/eventRoutes');
const reviewRouter = require('./routes/reviewRoutes');
// const bookingRouter = require('./routes/bookingRoutes');
// const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
app.options('*', cors());

// SERVING STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// SET SECURITY HTTP HEADERS
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'script-src': [
          "'self'",
          'https://cdnjs.cloudflare.com',
          'https://api.mapbox.com',
          'blob:'
        ],
        'default-src': ["'self'", 'https://*.mapbox.com']
      }
    }
  })
);
// app.use(helmet());

// DEVELOPMENT LOGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// LIMIT REQUESTS FROM SAME API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this ip, Please try again in an Hour!'
});
app.use('/api', limiter);

// BODY PARSER, READING DATA FROM BODY INTO req.body
app.use(express.json({ limit: '10kb' }));

// URL ENCODER, READING DATA FROM FORMS INTO req.body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// COOKIE PARSER, READING DATA FROM req.cookies
app.use(cookieParser());

// DATA SANITIZATION AGAINT NO-SQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINT XSS
app.use(xss());

// PREVENT PARAMETER PULLOTION
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

app.use(compression());

// TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.body);
  next();
});

// 3) ROUTES

// app.use('/', viewRouter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/artGroups', artGroupRouter);
app.use('/api/v1/shows', showRouter);
app.use('/api/v1/locations', locationRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/reviews', reviewRouter);
// app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
