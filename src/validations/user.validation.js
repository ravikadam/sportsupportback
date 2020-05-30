const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .custom(password),
    // title: Joi.string(),
    firstname: Joi.string().required(),
    lastname: Joi.string(),
    phone: Joi.string(),
    // role: Joi.string().required(),
    location: Joi.string(),
    address1: Joi.string(),
    address2: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    zipcode: Joi.string(),
  
    contact: Joi.string(),
    role: Joi.string(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    roleid: Joi.string(),
    title: Joi.string(),
    firstname: Joi.string(),
    lastname: Joi.string(),
    phone: Joi.string(),
    location: Joi.string(),
    address1: Joi.string(),
    address2: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    zipcode: Joi.string(),
    parentid: Joi.string(),
    organizationid: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      title: Joi.string(),
      firstname: Joi.string(),
      lastname: Joi.string(),
      phone: Joi.string(),
      location: Joi.string(),
      address1: Joi.string(),
      address2: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      zipcode: Joi.string(),
    
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
