import "./style.css";
import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

import Overlay from "./components/Overlay.jsx";
import App from "./App.jsx";

function LoadingScreen({ fadeOut }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 2000;
    const frame = () => {
      const elapsed = Date.now() - start;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(Math.round(p));
      if (p < 100) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, []);

  return (
    <div className={`loading-screen ${fadeOut ? "loading-screen--fade-out" : ""}`}>
      <div className="loading-content">
        <div className="loading-title">MOCHA CAT</div>
        <div className="loading-subtitle">Waking up your pet...</div>
        <div className="loading-bar-outer">
          <div className="loading-bar-inner" style={{ width: `${progress}%` }} />
        </div>
        <div className="loading-percent">{progress}%</div>
      </div>
    </div>
  );
}

function Root() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 600);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <App />
      <Overlay />
      {loading && <LoadingScreen fadeOut={fadeOut} />}
    </>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
