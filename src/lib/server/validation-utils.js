/**
 * Validates required parameters in a URL search params object
 * @param {URLSearchParams} searchParams - The URL search parameters to validate
 * @param {string[]} requiredParams - Array of parameter names that are required
 * @returns {Object} Result object containing either:
 *   - {string} error - 'Bad Request' if validation fails
 *   - {string} message - Error message describing missing/empty parameters
 *   - OR
 *   - {boolean} success - true if validation passes
 *   - {Object} params - Object containing extracted parameter values
 */
export function validateRequiredParams(searchParams, requiredParams) {
  // First check if all required parameters exist in searchParams
  const missingFields = requiredParams.filter(param => !searchParams.has(param));
  if (missingFields.length > 0) {
    return {
      error: 'Bad Request',
      message: `Required parameters not found: ${missingFields.join(', ')}`
    };
  }

  // Then check if any of the parameters are empty or null
  const emptyParams = requiredParams
    .filter(param => !searchParams.get(param))
    .map(param => param);

  if (emptyParams.length > 0) {
    return {
      error: 'Bad Request',
      message: `Missing values for parameters: ${emptyParams.join(', ')}`
    };
  }

  // If validation passes, return the extracted params object
  return {
    success: true,
    params: Object.fromEntries(
      requiredParams.map(param => [param, searchParams.get(param)])
    )
  };
} 