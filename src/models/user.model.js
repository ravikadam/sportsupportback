const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { omit, pick } = require('lodash');
// const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
    },
    role: {
      type: String,
      default: '',
    },
    
    name: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

userSchema.methods.toJSON = function() {
  const user = this;
  return omit(user.toObject(), ['password']);
};

userSchema.methods.transform = function() {
  const user = this;
  return pick(user.toJSON(), ['id', 'email', 'role']);
};

userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
