import { useState, useEffect } from "react";
import { useCatStore } from "../../state/catState";

export default function MoodBrainPanel() {
  const { getState } = useCatStore();
  const [state, setState] = useState(getState());

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getState());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: "#ffffff",
        border: "4px solid #000000",
        borderTop: "none",
        padding: "0",
        borderRadius: "0",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          background: "#000000",
          color: "#ff6600",
          padding: "8px 12px",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        MOOD & BRAIN
      </div>
      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Mood Display */}
        <div style={{ marginBottom: "15px" }}>
          <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>Mood:</div>
          <div
            style={{
              padding: "10px",
              background: "#f0f0f0",
              border: "2px solid #000000",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#ff6600",
              textAlign: "center",
            }}
          >
            {state.advanced.mood.label}
          </div>
          <div style={{ fontSize: "11px", color: "#666", textAlign: "center", marginTop: "5px" }}>
            {state.advanced.mood.value0to100}/100
          </div>
        </div>

        {/* Stats Bars */}
        <div style={{ marginBottom: "15px" }}>
          <div style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
              <span>Stress:</span>
              <span style={{ color: "#ff6600", fontWeight: "bold" }}>{Math.round(state.advanced.stress)}</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "20px",
                background: "#f0f0f0",
                border: "2px solid #000000",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${state.advanced.stress}%`,
                  height: "100%",
                  background: state.advanced.stress > 70 ? "#ff0000" : "#ff6600",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
              <span>Cleanliness:</span>
              <span style={{ color: "#ff6600", fontWeight: "bold" }}>{Math.round(state.advanced.cleanliness)}</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "20px",
                background: "#f0f0f0",
                border: "2px solid #000000",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${state.advanced.cleanliness}%`,
                  height: "100%",
                  background: "#4CAF50",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
              <span>Intelligence:</span>
              <span style={{ color: "#ff6600", fontWeight: "bold" }}>{Math.round(state.advanced.intelligence)}</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "20px",
                background: "#f0f0f0",
                border: "2px solid #000000",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${state.advanced.intelligence}%`,
                  height: "100%",
                  background: "#2196F3",
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
              <span>DNA Stability:</span>
              <span style={{ color: "#ff6600", fontWeight: "bold" }}>{Math.round(state.advanced.dnaStability)}</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "20px",
                background: "#f0f0f0",
                border: "2px solid #000000",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${state.advanced.dnaStability}%`,
                  height: "100%",
                  background: "#9C27B0",
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
