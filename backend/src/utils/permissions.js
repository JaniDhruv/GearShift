/**
 * Role-Based Permission Utilities
 * Clean Architecture Layer: Application / Domain Support
 */

/**
 * Checks whether a user's role matches any of the allowed roles (case-insensitive).
 *
 * @param {string} userRole Current user's role
 * @param {string[]} allowedRoles Array of allowed role strings
 * @returns {boolean} True if authorized, false otherwise
 */
const hasRole = (userRole, allowedRoles = []) => {
  if (!userRole) return false;
  const normalizedUserRole = String(userRole).toLowerCase();
  return allowedRoles.some(
    (allowed) => String(allowed).toLowerCase() === normalizedUserRole
  );
};

module.exports = {
  hasRole
};
