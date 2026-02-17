import { useState, useEffect, useRef } from "react";
import { useCatStore } from "../../state/catState";
import { drawChart } from "../../utils/charts";

const METRICS = [
  { key: "hunger", label: "Hunger", color: "#ff6600" },
  { key: "happiness", label: "Happiness", color: "#4CAF50" },
  { key: "health", label: "Health", color: "#F44336" },
  { key: "energy", label: "Energy", color: "#2196F3" },
  { key: "mood", label: "Mood", color: "#9C27B0" },
];

export default function AnalyticsPanel() {
  const { dispatch, getState } = useCatStore();
  const [state, setState] = useState(getState());
  const [selectedMetric, setSelectedMetric] = useState("happiness");
  const canvasRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getState());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (canvasRef.current && state.analytics.history[selectedMetric]) {
      drawChart(canvasRef.current, state.analytics.history[selectedMetric], METRICS.find(m => m.key === selectedMetric)?.color);
    }
  }, [state, selectedMetric]);

  const history = state.analytics.history[selectedMetric] || [];
  const avgValue = history.length > 0 
    ? Math.round(history.slice(-60).reduce((a, b) => a + b, 0) / Math.min(60, history.length))
    : 0;

  const handleClear = () => {
    if (confirm("Clear analytics history?")) {
      dispatch({ type: "CLEAR_ANALYTICS" });
    }
  };

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
        display: "flex",
        flexDirection: "column",
        pointerEvents: "auto",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          background: "#000000",
          color: "#ff6600",
          padding: "8px 12px",
          fontWeight: "bold",
          fontSize: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>ANALYTICS</span>
        <button
          onClick={handleClear}
          style={{
            padding: "4px 10px",
            background: "#ffffff",
            border: "2px solid #ff6600",
            borderRadius: "0",
            color: "#ff6600",
            cursor: "pointer",
            fontFamily: "DynaPuff, serif",
            fontSize: "11px",
          }}
        >
          Clear
        </button>
      </div>
      <div style={{ padding: "20px" }}>
        {/* Metric Selector */}
        <div style={{ marginBottom: "15px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {METRICS.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              style={{
                padding: "5px 10px",
                background: selectedMetric === metric.key ? "#ff6600" : "#ffffff",
                border: "2px solid #000000",
                borderRadius: "0",
                color: selectedMetric === metric.key ? "#ffffff" : "#000000",
                cursor: "pointer",
                fontFamily: "DynaPuff, serif",
                fontSize: "11px",
              }}
            >
              {metric.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div style={{ marginBottom: "15px", border: "2px solid #000000" }}>
          <canvas
            ref={canvasRef}
            width={360}
            height={200}
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div style={{ padding: "10px", background: "#f0f0f0", border: "2px solid #000000" }}>
            <div style={{ fontSize: "11px", color: "#666" }}>Avg (5min)</div>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ff6600" }}>{avgValue}</div>
          </div>
          <div style={{ padding: "10px", background: "#f0f0f0", border: "2px solid #000000" }}>
            <div style={{ fontSize: "11px", color: "#666" }}>Total Actions</div>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ff6600" }}>
              {Object.values(state.actionCounts).reduce((a, b) => a + b, 0)}
            </div>
          </div>
          <div style={{ padding: "10px", background: "#f0f0f0", border: "2px solid #000000" }}>
            <div style={{ fontSize: "11px", color: "#666" }}>Uptime</div>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ff6600" }}>
              {Math.floor(state.meta.ageMinutes / 60)}h {Math.floor(state.meta.ageMinutes % 60)}m
            </div>
          </div>
          <div style={{ padding: "10px", background: "#f0f0f0", border: "2px solid #000000" }}>
            <div style={{ fontSize: "11px", color: "#666" }}>Level</div>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ff6600" }}>{state.meta.level}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
