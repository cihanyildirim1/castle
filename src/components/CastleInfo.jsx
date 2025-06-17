import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CastleInfo({ castle, onClose }) {
  const [details, setDetails] = useState({
    description: "",
    wikiLink: "",
    images: [],
  });

  useEffect(() => {
    const qid = castle.tags?.wikidata;
    if (!qid) return;

    axios
      .get("https://www.wikidata.org/w/api.php", {
        params: {
          action: "wbgetentities",
          ids: qid,
          props: "descriptions|sitelinks|claims",
          languages: "en",
          format: "json",
          origin: "*",
        },
      })
      .then((res) => {
        const entity = res.data.entities[qid] || {};
        const desc = entity.descriptions?.en?.value || "";
        const enwiki = entity.sitelinks?.enwiki?.title;
        const wikiLink = enwiki
          ? `https://en.wikipedia.org/wiki/${encodeURIComponent(enwiki)}`
          : "";

        // Gather any P18 (image) claims
        const imageClaims = entity.claims?.P18 || [];
        const images = imageClaims.map((claim) => {
          const fileName = claim.mainsnak.datavalue.value;
          return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
            fileName
          )}`;
        });

        setDetails({ description: desc, wikiLink, images });
      })
      .catch((err) => console.error("Wikidata fetch error:", err));
  }, [castle]);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtnStyle}>
          Close
        </button>

        <div style={contentStyle}>
          <h3 style={headingStyle}>{castle.name}</h3>

          {details.description && <p style={textStyle}>{details.description}</p>}

          {details.wikiLink && (
            <p style={textStyle}>
              <a
                href={details.wikiLink}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                Read more on Wikipedia
              </a>
            </p>
          )}

          <div style={imageGridStyle}>
            {details.images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={castle.name}
                style={imageStyle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- styles ---------------------------------

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};

const modalStyle = {
  background: "#fff",
  borderRadius: "8px",
  width: "800px",
  maxHeight: "90vh",
  overflowY: "auto",
  padding: "2rem",
  position: "relative",
};

const closeBtnStyle = {
  position: "absolute",
  top: "1rem",
  right: "1rem",
  padding: "0.5rem 1rem",
  cursor: "pointer",
};

const contentStyle = {
  textAlign: "center",
};

const headingStyle = {
  margin: "0 0 1rem",
};

const textStyle = {
  margin: "0 0 1.5rem",
  lineHeight: 1.6,
};

const linkStyle = {
  color: "#0066cc",
  textDecoration: "none",
};

const imageGridStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "1.5rem",
  marginTop: "1.5rem",
};

const imageStyle = {
  maxWidth: "400px",
  width: "100%",
  height: "auto",
  margin: "0 auto",
  borderRadius: "4px",
};
