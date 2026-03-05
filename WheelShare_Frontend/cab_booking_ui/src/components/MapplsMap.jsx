/**
 * Mappls Map Component
 * Reusable component for displaying maps with Mappls
 * Features: markers, routes, popups, zoom controls
 */

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapplsMap.css';

const MapplsMap = forwardRef(({
  center = [19.0330, 73.0297],
  zoom = 13,
  height = '400px',
  markers = [],
  routes = [],
  routeStyle = { color: '#ef4444', weight: 4, opacity: 0.8 },
  onMapReady = null,
  onMarkerClick = null,
  onMapClick = null,
  showRoute = true,
  className = '',
}, ref) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const layerGroup = useRef(null);
  const markersRef = useRef({});
  const routesRef = useRef([]);

  useImperativeHandle(ref, () => ({
    getMap: () => map.current,
    centerMap,
    fitBounds,
    addPopup
  }));

  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = L.map(mapContainer.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);

      layerGroup.current = L.layerGroup().addTo(map.current);

      if (onMapReady) {
        onMapReady(map.current);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, []);

  // Update map click handler
  useEffect(() => {
    if (!map.current) return;

    map.current.off('click');

    if (onMapClick) {
      map.current.on('click', (e) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }
  }, [onMapClick]);

  // Update markers
  useEffect(() => {
    if (!map.current || !layerGroup.current) return;

    Object.values(markersRef.current).forEach((marker) => {
      layerGroup.current.removeLayer(marker);
    });
    markersRef.current = {};

    markers.forEach((markerData, index) => {
      const { lat, lng, label = '', color = '#3b82f6', icon = null } = markerData;

      let markerIcon = L.icon({
        iconUrl: icon || 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      if (color && !icon) {
        const svgMarker = `
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.16344 0 0 7.16344 0 16C0 25 16 40 16 40C16 40 32 25 32 16C32 7.16344 24.8366 0 16 0Z" fill="${color}" />
            <circle cx="16" cy="16" r="5" fill="white" />
          </svg>
        `;
        markerIcon = L.icon({
          iconUrl: `data:image/svg+xml;base64,${btoa(svgMarker)}`,
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -40],
        });
      }

      const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(layerGroup.current);

      if (label) {
        marker.bindPopup(label);
        marker.on('click', () => {
          if (onMarkerClick) {
            onMarkerClick(markerData, index);
          }
        });
      }

      markersRef.current[index] = marker;
    });

    if (markers.length > 1 && map.current) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (markers.length === 1) {
      map.current.setView([markers[0].lat, markers[0].lng], zoom);
    }
  }, [markers, zoom, onMarkerClick]);

  // Update routes
  useEffect(() => {
    if (!map.current || !layerGroup.current || !showRoute) return;

    routesRef.current.forEach((polyline) => {
      layerGroup.current.removeLayer(polyline);
    });
    routesRef.current = [];

    routes.forEach((route) => {
      if (route && route.length > 0) {
        const polyline = L.polyline(route, {
          color: routeStyle.color,
          weight: routeStyle.weight,
          opacity: routeStyle.opacity,
          dashArray: routeStyle.dashArray || null,
        }).addTo(layerGroup.current);

        routesRef.current.push(polyline);
      }
    });
  }, [routes, routeStyle, showRoute]);

  const centerMap = (lat, lng, zoomLevel = zoom) => {
    if (map.current) {
      map.current.setView([lat, lng], zoomLevel);
    }
  };

  const fitBounds = (points) => {
    if (map.current && points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const addPopup = (lat, lng, content) => {
    if (map.current) {
      L.popup()
        .setLatLng([lat, lng])
        .setContent(content)
        .openOn(map.current);
    }
  };

  return (
    <div
      ref={mapContainer}
      className={`mappls-map-container ${className}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: onMapClick ? 'crosshair' : 'grab'
      }}
      data-testid="mappls-map"
    />
  );
});

MapplsMap.displayName = 'MapplsMap';

export default MapplsMap;