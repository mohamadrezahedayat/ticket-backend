const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-<userId>-<currentTimeStamp>.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

// general configuration
const multerStorage = multer.memoryStorage();

const muterFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: muterFilter });

// user photo image controller
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  if (req.user) {
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  } else {
    req.file.filename = `user-${
      req.body.email.split('@')[0]
    }-${Date.now()}.jpeg`;
  }

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  req.body.photo = req.file.filename;
  next();
});

// artgroup image controller
exports.uploadArtGroupPhotos = upload.fields([{ name: 'images', maxCount: 5 }]);

exports.resizeArtGroupPhotos = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `artgroup-${req.body.name.replaceAll(
        ' ',
        '-'
      )}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(700, 700)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/artists/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

// show image controller
exports.uploadShowPhotos = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'imageCover', maxCount: 1 }
]);

exports.resizeShowPhotos = catchAsync(async (req, res, next) => {
  if (!req.files.images || !req.files.imageCover) return next();
  // cover Image
  req.body.imageCover = `show-cover-${req.body.name.replaceAll(
    ' ',
    '-'
  )}-${Date.now()}.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/shows/${req.body.imageCover}`);

  // images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `show-${req.body.name.replaceAll(
        ' ',
        '-'
      )}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(700, 1000)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/shows/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

// location image controller
exports.uploadLocationPhotos = upload.fields([{ name: 'images', maxCount: 5 }]);

exports.resizeLocationPhotos = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `location-${req.body.name.replaceAll(
        ' ',
        '-'
      )}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(700, 700)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/locations/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});
