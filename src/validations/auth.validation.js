const Joi = require('@hapi/joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .custom(password),
    name: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string(),
    role: Joi.array(),
    accesscode: Joi.string(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string()
      .required()
      .custom(password),
  }),
};
const verifyJwt = {
  body: Joi.object().keys({
    jwtToken: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyJwt,
};
