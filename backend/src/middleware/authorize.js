/**
 * Reusable Role-Based Authorization Middleware
 * Clean Architecture Layer: Interface Adapters
 *
 * @param  {...string} allowedRoles list of allowed roles (case-insensitive)
 * @returns {Function} Express middleware function
 */
const authorize = (...allowedRoles) => {
  const normalizedRoles = allowedRoles.map((role) => role.toLowerCase());

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!normalizedRoles.includes(req.user.role.toLowerCase())) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    return next();
  };
};

module.exports = {
  authorize
};
