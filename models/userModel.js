const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email!']
  },
  mobile: {
    type: String,
    unique: true,
    validate: [validator.isMobilePhone, 'please provide a valid Mobile number!']
  },
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    enum: ['user', 'show-manager', 'admin', 'super-admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // this only works on create and save!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'paswords are not the same!'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  country: String,
  needSupport: Boolean
});

// hash password when saving new password and unset password confirm property
userSchema.pre('save', async function(next) {
  // only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// to fill property passworchChangedAt when changing password
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// to not show diactive users
userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// compare actual password by user input password when signing in
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  // todo this function has a bug
  return await bcrypt.compare(candidatePassword, userPassword);
};

// compare password changed  timestamp to JWT timestamp
userSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  // false means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
