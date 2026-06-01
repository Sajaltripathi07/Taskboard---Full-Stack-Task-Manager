const { validationResult } = require('express-validator');
const { sendError }        = require('../utils/response');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    const firstMessage = errors.array()[0].msg;
    return res.status(422).json({
      success: false,
      message: firstMessage,
      errors:  errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = validate;
