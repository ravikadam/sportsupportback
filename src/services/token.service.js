const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const { Token } = require('../models');
const AppError = require('../utils/AppError');
const logger = require('../config/logger');


const generateToken = (userId, expires, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const verifyToken = async (token, type) => {
  logger.info(`JWT key is ${config.jwt.secret} AND type is ${type}`)
  const payload = jwt.verify(token, config.jwt.secret);
  logger.info(`Payload is ${payload.sub}`)
  const tokenDoc = await Token.findOne({ token:token, type:type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new AppError(httpStatus.NOT_FOUND, 'Token not found');
  }
  return tokenDoc;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
};
