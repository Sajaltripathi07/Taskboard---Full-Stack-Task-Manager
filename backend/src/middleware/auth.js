

const { verifyToken } = require('../utils/jwt');
const { sendError }   = require('../utils/response');

function authMiddleware(req, res, next) {
  // Extract the bearer token from the Authorization header.
  const authHeader = req.headers.authorization || '';
  const token      = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return sendError(res, 'Authentication token missing.', 401);
  }

  try {
    const decoded = verifyToken(token);
    // Attach a minimal user object – controllers read from req.user.
    req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
    next();
  } catch (err) {
    // Distinguish expired tokens for clearer client-side error handling.
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired. Please log in again.', 401);
    }
    return sendError(res, 'Invalid authentication token.', 401);
  }
}

module.exports = authMiddleware;
