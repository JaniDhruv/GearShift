/**
 * Formats a numeric value as US Dollar currency ($XX,XXX).
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats mileage numbers with commas and suffix.
 */
export function formatMileage(miles) {
  if (miles === undefined || miles === null) return '0 mi';
  return `${new Intl.NumberFormat('en-US').format(miles)} mi`;
}

/**
 * Formats ISO date string to readable localized date.
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
