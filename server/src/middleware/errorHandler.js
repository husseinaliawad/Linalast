const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Server error';
  const errors = err.errors || null;

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return sendError(res, status, message, errors);
};

module.exports = errorHandler;
