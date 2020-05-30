const winston = require('winston');
const config = require('./config');

require('winston-mongodb');
 

// const enumerateErrorFormat = winston.format(info => {
//   if (info instanceof Error) {
//     Object.assign(info, { message: info.stack });
//   }
//   return info;
// });

const loggermongo = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  
  transports: [
   
  
    new winston.transports.MongoDB( {
      db: config.mongoose.url,
      level : config.env === 'development' ? 'debug' : 'info',
          }),
    
    
    

  ],
});

module.exports = loggermongo;
