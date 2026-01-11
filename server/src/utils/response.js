const sendSuccess = (res, data, message) => {
  return res.json({
    success: true,
    message: message || null,
    data,
  });
};

const sendError = (res, statusCode, message, errors) => {
  return res.status(statusCode).json({
    success: false,
    message: message || 'Request failed',
    errors: errors || null,
  });
};

module.exports = { sendSuccess, sendError };
