// src/App.jsx
import React, { useState } from "react";
import WelcomePage from "./components/WelcomePage";
import WorldMap from "./components/WorldMap";
import CountryMap from "./components/CountryMap";

export default function App() {
  const [started, setStarted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountrySelect = (feature) => {
    setSelectedCountry(feature);
  };
  const closeCountry = () => setSelectedCountry(null);

  // optional: put whatever info you like here
  const countryInfo = selectedCountry
    ? `ISO-A3: ${selectedCountry.properties["ISO3166-1-Alpha-3"]}`
    : "";

  if (!started) {
    return <WelcomePage onStart={() => setStarted(true)} />;
  }

  return (
    <>
      <WorldMap onCountrySelect={handleCountrySelect} />

      {selectedCountry && (
        <CountryMap
          feature={selectedCountry}
          info={countryInfo}
          onClose={closeCountry}
        />
      )}
    </>
  );
}
