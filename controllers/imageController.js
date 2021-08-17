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

const multerStorage = multer.memoryStorage();

const muterFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: muterFilter });

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
