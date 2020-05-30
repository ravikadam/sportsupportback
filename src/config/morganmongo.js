const morgan1 = require('mongoose-morgan');

const config = require('./config');
const loggermongo = require('./loggermongo');

morgan1.token('message', (req, res) => res.locals.errorMessage || '');


morgan1.token('usage', (req, res) => (req.hasOwnProperty('user')) ?res.locals.errorMessage || req.user.email:'No User');


morgan1.token('useragent', (req, res) => res.locals.errorMessage || req.get('user-agent'));


const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : ':remote-addr - ');

const successResponseFormatMongo = `{ip:${getIpFormat()} ,log_date: :date[iso] ,method:  :method , url: :url , status: :status, response:  :response-time , usage:  :usage,useragent:  :useragent}`;
const errorResponseFormatMongo = `{ip:${getIpFormat()}, log_date:  :date[iso] , method:  :method, url: :url, status:  :status , response:  :response-time ,  message: :message, usage: :usage, useragent: :useragent}`;



const successHandlerMongo = morgan1({
  
  connectionString: config.mongoose.url,
  stream: { write: message => loggermongo.info(message.trim()) },
},{skip: function (req, res) {
  return res.statusCode >= 400;
}},successResponseFormatMongo);

const errorHandlerMongo = morgan1( {
  connectionString:config.mongoose.url,
  stream: { write: message => loggermongo.error(message.trim()) },
},{skip: function (req, res) {
  return res.statusCode < 400;
}},errorResponseFormatMongo);



module.exports = {
 
  successHandlerMongo,
  errorHandlerMongo,
};
