/**
 * Mappls Configuration
 * This module initializes and exports the Mappls API configuration
 */

export const MAPPLS_CONFIG = {
  apiKey: import.meta.env.VITE_MAPPLS_API_KEY || '',
  trafficApiKey: import.meta.env.VITE_MAPPLS_TRAFFIC_API_KEY || '',
  baseUrl: 'https://apis.mappls.com',
};

/**
 * Validate Mappls configuration
 * @returns {boolean} True if configuration is valid
 */
export const validateMapplsConfig = () => {
  if (!MAPPLS_CONFIG.apiKey) {
    console.warn('Mappls API key is not configured. Please set VITE_MAPPLS_API_KEY in .env.local');
    return false;
  }
  return true;
};

/**
 * Get authorization headers for Mappls API calls
 * @returns {object} Headers object with authorization
 */
export const getMapplsHeaders = () => {
  return {
    'X-Api-Key': MAPPLS_CONFIG.apiKey,
    'Content-Type': 'application/json',
  };
};
