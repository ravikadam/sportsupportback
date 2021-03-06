const passport = require('passport');
const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const { roleRights } = require('../config/roles');
const logger = require('../config/logger');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new AppError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get('user');
    const hasRequiredRights = requiredRights.every(requiredRight => userRights.includes(requiredRight));
   // logger.debug(`user id is ${user.id} and role is ${user.role[0]} required rights ${requiredRights} req ${req}`);
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new AppError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch(err => next(err));
};

module.exports = auth;
