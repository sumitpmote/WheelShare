/**
 * Mappls Utility Service
 * Provides functions for geocoding, routing, reverse geocoding, and distance calculations
 * Uses the same latitude/longitude coordinates from the system
 * 
 * NOTE: All Mappls API calls are proxied through the backend to avoid CORS issues
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Geocode an address to get latitude and longitude coordinates
 * @param {string} address - The address to geocode
 * @returns {Promise<Object>} Object with lat, lng, and address details
 */
export const geocodeAddress = async (address) => {
  try {
    if (!address.trim()) {
      throw new Error('Address cannot be empty');
    }

    console.log('Geocoding address:', address);
    
    // Try Nominatim API with multiple search strategies
    let response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5&countrycodes=in`
    );

    if (!response.ok) {
      throw new Error('Geocoding service failed');
    }

    let data = await response.json();
    
    // If no results, try with just the first word or last word
    if (!data || data.length === 0) {
      const words = address.split(',');
      const firstWord = words[0].trim();
      
      response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(firstWord)}&limit=5&countrycodes=in`
      );
      data = await response.json();
    }

    // If still no results, try without country code
    if (!data || data.length === 0) {
      response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`
      );
      data = await response.json();
    }

    if (data && data.length > 0) {
      // Get the first (best) result
      const result = data[0];
      console.log('Geocoding result:', result);
      
      return {
        lat: Number.parseFloat(result.lat),
        lng: Number.parseFloat(result.lon),
        address: result.display_name || address,
      };
    }

    // If still not found, throw error
    throw new Error(`Location "${address}" not found. Try with city name or landmark name.`);
    
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to find location: ' + (error.message || 'Unknown error'));
  }
};

/**
 * Get route between two coordinates using OpenStreetMap (OSRM)
 * Returns road-based route with waypoints
 * @param {number} startLat - Starting latitude
 * @param {number} startLng - Starting longitude
 * @param {number} endLat - Ending latitude
 * @param {number} endLng - Ending longitude
 * @param {Object} options - Additional options
 * @param {boolean} options.traffic - Consider traffic (not available in free OSRM)
 * @param {string} options.routeType - Route type: 'fastest', 'shortest' (default: 'fastest')
 * @returns {Promise<Object>} Route object with distance, duration, and geometry
 */
export const getRoute = async (
  startLat,
  startLng,
  endLat,
  endLng,
  options = {}
) => {
  try {
    if (!startLat || !startLng || !endLat || !endLng) {
      throw new Error('All coordinates are required');
    }

    // Use OSRM (OpenStreetMap Routing Machine) - free, no API key needed
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&steps=true&geometries=geojson`
    );

    if (!response.ok) {
      throw new Error('Routing failed');
    }

    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const geometryPoints = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

      return {
        distance: route.distance, // in meters
        duration: route.duration, // in seconds
        durationText: formatDuration(route.duration),
        distanceText: formatDistance(route.distance),
        geometry: geometryPoints,
        polyline: route.geometry,
        steps: route.legs?.[0]?.steps || [],
      };
    }

    throw new Error('No route found');
  } catch (error) {
    console.error('Routing error:', error);
    // Fallback to straight line
    const distance = calculateDistance(startLat, startLng, endLat, endLng);
    const estimatedDuration = (distance / 40) * 3600; // Assume 40 km/h average
    return {
      distance: distance * 1000,
      duration: estimatedDuration,
      durationText: formatDuration(estimatedDuration),
      distanceText: formatDistance(distance * 1000),
      geometry: [[startLat, startLng], [endLat, endLng]],
      steps: [],
    };
  }
};

/**
 * Get route with ETA (uses same function as getRoute, no traffic API needed)
 * @param {number} startLat - Starting latitude
 * @param {number} startLng - Starting longitude
 * @param {number} endLat - Ending latitude
 * @param {number} endLng - Ending longitude
 * @returns {Promise<Object>} Route with ETA
 */
export const getRouteWithETA = async (startLat, startLng, endLat, endLng) => {
  return getRoute(startLat, startLng, endLat, endLng, {
    traffic: false,
    routeType: 'fastest',
  });
};

/**
 * Calculate distance between two points in kilometers
 * Uses Haversine formula for great-circle distance
 * @param {number} lat1 - First latitude
 * @param {number} lng1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lng2 - Second longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Reverse geocode coordinates to get address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Address string
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    if (!lat || !lng) {
      throw new Error('Coordinates are required');
    }

    // Use Nominatim reverse geocoding with maximum zoom for precise address
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=19&extratags=1`
    );

    if (response.ok) {
      const data = await response.json();
      
      // Build precise address from components
      const addr = data.address || {};
      const parts = [];
      
      // Add house number and road (most specific)
      if (addr.house_number && addr.road) {
        parts.push(`${addr.house_number} ${addr.road}`);
      } else if (addr.road) {
        parts.push(addr.road);
      } else if (addr.pedestrian) {
        parts.push(addr.pedestrian);
      } else if (addr.footway) {
        parts.push(addr.footway);
      }
      
      // Add more specific locality info
      if (addr.neighbourhood) parts.push(addr.neighbourhood);
      else if (addr.suburb) parts.push(addr.suburb);
      else if (addr.locality) parts.push(addr.locality);
      else if (addr.quarter) parts.push(addr.quarter);
      
      // Add city/town
      if (addr.city) parts.push(addr.city);
      else if (addr.town) parts.push(addr.town);
      else if (addr.village) parts.push(addr.village);
      else if (addr.municipality) parts.push(addr.municipality);
      
      // Add state/region if available
      if (addr.state) parts.push(addr.state);
      
      // Return precise address or fallback to display_name
      const preciseAddress = parts.length > 0 ? parts.join(', ') : data.display_name;
      
      // If we still don't have a good address, try to get nearby POI
      if (!addr.house_number && !addr.road && data.display_name) {
        return data.display_name;
      }
      
      return preciseAddress || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

/**
 * Parse geometry from Mappls response
 * Handles both encoded polylines and direct coordinates
 * @param {string|Array} geometry - Encoded polyline or coordinates array
 * @returns {Array} Array of [lat, lng] coordinates
 */
const parseGeometry = (geometry) => {
  if (!geometry) return [];

  if (Array.isArray(geometry)) {
    return geometry.map((point) => [point.lat || point[0], point.lng || point[1]]);
  }

  if (typeof geometry === 'string') {
    // Decode polyline if needed
    return decodePolyline(geometry);
  }

  return [];
};

/**
 * Decode polyline string to coordinates
 * @param {string} polyline - Encoded polyline
 * @returns {Array} Array of [lat, lng] coordinates
 */
const decodePolyline = (polyline) => {
  const points = [];
  let lat = 0;
  let lng = 0;
  let i = 0;

  while (i < polyline.length) {
    let char = polyline.codePointAt(i) - 63;
    i += 1;
    lat += (char >> 1) ^ -(char & 1);
    char = polyline.codePointAt(i) - 63;
    i += 1;
    lng += (char >> 1) ^ -(char & 1);
    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
};

/**
 * Format duration in seconds to readable string
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
const formatDuration = (seconds) => {
  if (!seconds) return '0 min';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Format distance for display
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance
 */
const formatDistance = (meters) => {
  if (!meters) return '0 km';

  const km = meters / 1000;
  if (km >= 1) {
    return `${km.toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
};

/**
 * Get nearby places
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} query - Search query
 * @param {number} radius - Radius in meters (default: 5000)
 * @returns {Promise<Array>} Array of places
 */
export const getNearbyPlaces = async (lat, lng, query, radius = 5000) => {
  try {
    const response = await axios.get(
      `${MAPPLS_CONFIG.baseUrl}/apis/v1/place_search`,
      {
        params: {
          query: query,
          lat: lat,
          lng: lng,
          radius: radius,
          apiKey: MAPPLS_CONFIG.apiKey,
        },
      }
    );

    return response.data?.results || [];
  } catch (error) {
    console.error('Nearby places error:', error);
    return [];
  }
};

/**
 * Batch geocode multiple addresses
 * @param {Array<string>} addresses - Array of addresses
 * @returns {Promise<Array>} Array of geocoded results
 */
export const batchGeocode = async (addresses) => {
  try {
    const results = await Promise.allSettled(
      addresses.map((addr) => geocodeAddress(addr))
    );

    return results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value);
  } catch (error) {
    console.error('Batch geocoding error:', error);
    return [];
  }
};
