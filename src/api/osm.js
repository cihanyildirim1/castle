// src/api/osm.js
import axios from "axios";

/**
 * Fetch all OSM objects tagged `historic=castle` within the given ISO-A3 country.
 * Returns Array<{ id, name, tags, position }>.
 */
export async function fetchCastlesFromOSM(isoA3) {
  if (typeof isoA3 !== "string" || !isoA3.trim()) {
    console.error("fetchCastlesFromOSM: invalid ISO-A3 code:", isoA3);
    return [];
  }
  const code = isoA3.trim().toUpperCase();
  console.log("🔍 fetchCastlesFromOSM for code:", code);

  const query = `
    [out:json][timeout:25];
    area["ISO3166-1:alpha3"="${code}"][admin_level=2];
    (
      node["historic"="castle"](area);
      way ["historic"="castle"](area);
      relation["historic"="castle"](area);
    );
    out center tags;
  `;

  try {
    const res = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" } }
    );

    const elements = res.data.elements || [];
    console.log("🔍 Overpass returned", elements.length, "elements");

    return elements.map((el) => {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      return {
        id:       `${el.type}/${el.id}`,
        name:     el.tags?.name || "Castle",
        tags:     el.tags || {},
        position: [lat, lon],
      };
    });
  } catch (err) {
    console.error("❌ Overpass API error:", err);
    return [];
  }
}
