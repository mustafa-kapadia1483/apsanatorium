/**
 * Formats a number as Indian Rupees (INR) currency
 * @param {number} amount - The amount to format
 * @returns {string} The formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}
