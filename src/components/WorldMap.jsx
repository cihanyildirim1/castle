// src/components/WorldMap.jsx
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

export default function WorldMap({ onCountrySelect }) {
  const [countries, setCountries] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    fetch("/countries.geojson")
      .then((res) => res.json())
      .then(setCountries)
      .catch(console.error);
  }, []);

  // default “almost-white” style
  const defaultStyle = {
    color: "rgba(228, 223, 61, 0.75)",    // border
    weight: 1,
    fillColor: "rgba(19, 19, 122, 0.75)",
    fillOpacity: 0.3,
  };

  // hover / highlight style (persistent)
  const highlightStyle = {
    color: "#4a83ec",
    weight: 2,
    fillColor: "#4a83ec",
    fillOpacity: 0.6,
  };

  const onEachCountry = (feature, layer) => {
    // apply default style initially
    layer.setStyle(defaultStyle);

    layer.on({
      click: () => onCountrySelect(feature),
      mouseover: (e) => {
        e.target.setStyle(highlightStyle);
      }
      // no mouseout — once hovered, stays highlighted
    });
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
      whenCreated={(map) => (mapRef.current = map)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {countries && (
        <GeoJSON
          data={countries}
          style={defaultStyle}
          onEachFeature={onEachCountry}
        />
      )}
    </MapContainer>
  );
}
