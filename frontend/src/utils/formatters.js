/**
 * Formats a numeric value as Indian Rupee currency (₹XX,XX,XXX).
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number with Indian numbering system commas (XX,XX,XXX).
 */
export function formatINRNumber(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0';
  return Number(amount).toLocaleString('en-IN');
}

/**
 * Formats mileage numbers with commas and suffix.
 */
export function formatMileage(km) {
  if (km === undefined || km === null) return '0 km';
  return `${Number(km).toLocaleString('en-IN')} km`;
}

/**
 * Formats ISO date string to readable localized date.
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
