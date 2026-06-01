
const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');


async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });

    return sendSuccess(
      res,
      { user: result.user, token: result.token },
      201
    );
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    return sendSuccess(res, { user: result.user, token: result.token });
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
}


function me(req, res) {
  return sendSuccess(res, { user: req.user });
}

module.exports = { register, login, me };
