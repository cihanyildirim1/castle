// src/components/WelcomePage.jsx
import React from "react";
import { motion } from "framer-motion";
import castleBg from "../assets/castle4.jpg";

export default function WelcomePage({ onStart }) {
  return (
    <motion.div
      style={container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        style={box}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        whileHover={{ scale: 1.03 }}
      >
        <motion.h1
          style={title}
          initial={{ letterSpacing: "0.5em", opacity: 0 }}
          animate={{ letterSpacing: "normal", opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Castle Explorer
        </motion.h1>
        <motion.p
          style={subtitle}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Discover castles around the world—click on a country to begin!
        </motion.p>
        <motion.button
          style={button}
          onClick={onStart}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter Map
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

const container = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100%",
  backgroundImage: `url(${castleBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
};

const box = {
  maxWidth: "500px",
  padding: "2rem",
  borderRadius: "8px",
  background: "rgba(0, 0, 0, 0.5)",
  textAlign: "center",
};

const title = {
  fontSize: "3rem",
  margin: "0 0 1rem",
  color: "#fff",
};

const subtitle = {
  fontSize: "1.25rem",
  margin: "0 0 2rem",
  color: "#eee",
};

const button = {
  padding: "0.75rem 2rem",
  fontSize: "1.1rem",
  border: "none",
  borderRadius: "4px",
  background: "#ffcc00",
  color: "#333",
  cursor: "pointer",
};
