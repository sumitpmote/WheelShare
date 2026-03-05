import { MapContainer, TileLayer } from "react-leaflet";

function MapTest() {
  return (
    <div style={{ padding: "20px" }}>
      <h3>Map Test</h3>

      <MapContainer
        center={[18.5204, 73.8567]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
      </MapContainer>
    </div>
  );
}

export default MapTest;
