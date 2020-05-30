const morgan = require('morgan');

const config = require('./config');
const logger = require('./logger');

morgan.token('message', (req, res) => res.locals.errorMessage || '');


morgan.token('usage', (req, res) => (req.hasOwnProperty('user')) ?res.locals.errorMessage || req.user.email:'No User');


morgan.token('useragent', (req, res) => res.locals.errorMessage || req.get('user-agent'));


const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : ':remote-addr - ');
const successResponseFormat = `${getIpFormat()} :date[iso]  :method :url :status - :response-time ms :usage :useragent`;
const errorResponseFormat = `${getIpFormat()} :date[iso] :method :url :status - :response-time ms - message: :message :usage :useragent`;


const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: message => logger.info("*****"+message.trim()) },
});



const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: message => logger.error("~~~~~"+message.trim()) },
});

module.exports = {
  successHandler,
  errorHandler,
  
};
