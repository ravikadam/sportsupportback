const mongoose = require('mongoose');
const { pick } = require('lodash');

const contactSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
    },
    phone: {
      type: String,
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    zipcode: {
      type: String,
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

contactSchema.methods.toJSON = function() {
  const contact = this;
  return contact.toObject();
};

contactSchema.methods.transform = function() {
  const contact = this;
  return pick(contact.toJSON());
};

contactSchema.pre('save', async function(next) {
  next();
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
