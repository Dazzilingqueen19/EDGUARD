import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error("No #root element in index.html");
} else {
  createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
