import { useState, useEffect } from "react";
import { useCatStore } from "../../state/catState";

export default function SettingsPanel() {
  const { dispatch, getState } = useCatStore();
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
        maxWidth: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        pointerEvents: "auto",
        boxSizing: "border-box",
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
        SETTINGS
      </div>
      <div style={{ padding: "20px" }}>
        {/* Toggles */}
        <div style={{ marginBottom: "15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span>Rotation</span>
            <div
              onClick={() => dispatch({ type: "TOGGLE_ROTATION" })}
              style={{
                width: "50px",
                height: "25px",
                background: state.flags.rotationEnabled ? "#ff6600" : "#f0f0f0",
                border: "2px solid #000000",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: state.flags.rotationEnabled ? "26px" : "4px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "19px",
                  height: "19px",
                  background: "#ffffff",
                  border: "2px solid #000000",
                  transition: "left 0.3s",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span>Music</span>
            <div
              onClick={() => dispatch({ type: "TOGGLE_MUSIC" })}
              style={{
                width: "50px",
                height: "25px",
                background: state.flags.musicEnabled ? "#ff6600" : "#f0f0f0",
                border: "2px solid #000000",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: state.flags.musicEnabled ? "26px" : "4px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "19px",
                  height: "19px",
                  background: "#ffffff",
                  border: "2px solid #000000",
                  transition: "left 0.3s",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span>Chaos Mode</span>
            <div
              onClick={() => dispatch({ type: "TOGGLE_CHAOS" })}
              style={{
                width: "50px",
                height: "25px",
                background: state.flags.chaosMode ? "#ff6600" : "#f0f0f0",
                border: "2px solid #000000",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: state.flags.chaosMode ? "26px" : "4px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "19px",
                  height: "19px",
                  background: "#ffffff",
                  border: "2px solid #000000",
                  transition: "left 0.3s",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <span>Debug Mode</span>
            <div
              onClick={() => dispatch({ type: "TOGGLE_DEBUG" })}
              style={{
                width: "50px",
                height: "25px",
                background: state.flags.debugMode ? "#ff6600" : "#f0f0f0",
                border: "2px solid #000000",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: state.flags.debugMode ? "26px" : "4px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "19px",
                  height: "19px",
                  background: "#ffffff",
                  border: "2px solid #000000",
                  transition: "left 0.3s",
                }}
              />
            </div>
          </div>
        </div>

        {/* Tick Speed */}
        <div style={{ marginBottom: "15px", paddingTop: "15px", borderTop: "2px solid #000000" }}>
          <div style={{ fontSize: "12px", marginBottom: "5px" }}>Tick Speed: {state.tickSpeed}x</div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={state.tickSpeed}
            onChange={(e) => dispatch({ type: "SET_TICK_SPEED", payload: { speed: parseInt(e.target.value) } })}
            style={{
              width: "100%",
            }}
          />
        </div>

      </div>
    </div>
  );
}
