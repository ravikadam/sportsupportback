const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { User } = require('../models');
const logger = require('../config/logger');


const jwtOptions = {
  
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

//logger.debug(`JWT FROM REQUEST ${jwtOptions.jwtFromRequest}`);

const jwtVerify = async (payload, done) => {
  try {
   // logger.debug(`checking user ${payload.sub}`);
    const user = await User.findById(payload.sub);
    if (!user) {
     // logger.debug('did not find user')
      return done(null, false);
    }
    //req.user = user
    //logger.debug({user})
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
