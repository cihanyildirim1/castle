// src/components/CountryMap.jsx
import React, { useState, useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
} from "react-leaflet";
import { fetchCastlesFromOSM } from "../api/osm";
import CastleInfo from "./CastleInfo";
import castlePng from "../assets/castle.png";

// custom castle icon
const castleIcon = new L.Icon({
  iconUrl: castlePng,
  iconRetinaUrl: castlePng,
  shadowUrl: null,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// fix default marker icon paths
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
});

export default function CountryMap({ feature, info, onClose }) {
  const [castles, setCastles] = useState([]);
  const [selectedCastle, setSelectedCastle] = useState(null);

  const iso3 = useMemo(() => {
    if (!feature?.properties) return "";
    const p = feature.properties;
    return (
      p["ISO3166-1-Alpha-3"] ||
      p.ISO_A3 ||
      p.iso_a3 ||
      p.ADM0_A3 ||
      ""
    ).toString();
  }, [feature]);

  useEffect(() => {
    if (!iso3) return;
    fetchCastlesFromOSM(iso3)
      .then(setCastles)
      .catch(console.error);
  }, [iso3]);

  const bounds = useMemo(() => {
    if (!feature) return null;
    return L.geoJSON(feature).getBounds();
  }, [feature]);

  if (!feature || !bounds) return null;

  return (
    <>
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <button onClick={onClose} style={closeBtnStyle}>
            Close
          </button>

          <h2 style={headerStyle}>
            {feature.properties.name || feature.properties.ADMIN}
          </h2>
          {info && <p style={textStyle}>{info}</p>}

          <MapContainer
            key={iso3}
            bounds={bounds}
            style={{ width: "100%", height: "85vh" }}
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />

            <GeoJSON
              data={feature}
              style={{
                color: "#4a83ec",
                weight: 2,
                fillColor: "#1a1d62",
                fillOpacity: 0.3,
              }}
            />

            {castles.map((c) => (
              <Marker
                key={c.id}
                position={c.position}
                icon={castleIcon}
                eventHandlers={{
                  click: () => setSelectedCastle(c),
                }}
              >
                <Popup
                  minWidth={300}
                  maxWidth={500}
                  className="leaflet-popup-dark"
                >
                  <div style={{ color: "#fff" }}>{c.name}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {selectedCastle && (
        <CastleInfo
          castle={selectedCastle}
          onClose={() => setSelectedCastle(null)}
        />
      )}
    </>
  );
}

// --- styles ---------------------------------

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(18, 18, 21, 0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};

const modalStyle = {
  background: "#4a83ec",
  color: "#fff",
  borderRadius: "18px",
  width: "90vw",
  height: "90vh",
  padding: "1rem",
  position: "relative",
  display: "flex",
  flexDirection: "column",
};

const closeBtnStyle = {
  position: "absolute",
  top: "1.5rem",
  right: "1.5rem",
  padding: "0.25rem 0.5rem",
  fontSize: "1rem",
  cursor: "pointer",
  background: "none",
  border: "1px solid #fff",
  color: "#fff",
  borderRadius: "13px",
};

const headerStyle = {
  margin: "0 0 0.5em",
  color: "#fff",
};

const textStyle = {
  marginTop: 0,
  color: "#eee",
};
