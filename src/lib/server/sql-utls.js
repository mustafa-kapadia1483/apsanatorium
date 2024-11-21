/**
 * Formats a SQL date column to a specified format or returns a default value if the date is null.
 * @param {string} dateColumn - The name of the SQL date column to format.
 * @param {Object} [options] - Formatting options
 * @param {string} [options.format='dd-MMM-yyyy'] - The desired date format pattern
 * @param {string} [options.nullValue=''] - The value to return when the date is null
 * @returns {string} The SQL CASE statement for formatting the date column.
 */
export function formatDateOrEmpty(dateColumn, options = { format: 'dd-MMM-yyyy', nullValue: '' }) {
  return `
    CASE 
        WHEN ${dateColumn} IS NOT NULL 
        THEN FORMAT(${dateColumn}, '${options.format}') 
        ELSE '${options.nullValue}'
    END
  `.trim();
}