const { authenticate, generateToken } = require('./auth');
const { errorHandler, notFound } = require('./errorHandler');
const logger = require('./logger');
const authorize = require('./authorize');

module.exports = {
  authenticate,
  generateToken,
  errorHandler,
  notFound,
  logger,
  authorize,
};
