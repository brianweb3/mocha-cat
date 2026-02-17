import { useState, useEffect } from "react";
import { useCatStore } from "../../state/catState";
import { formatRelativeTime, formatExactTime } from "../../utils/time";

const FILTERS = ["All", "action", "economy", "system", "chat"];

export default function TimelinePanel() {
  const { getState } = useCatStore();
  const [state, setState] = useState(getState());
  const [filter, setFilter] = useState("All");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getState());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredTimeline = filter === "All" 
    ? state.timeline 
    : state.timeline.filter((e) => e.type === filter);

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tamagotchi-save-${Date.now()}.json`;
    link.click();
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
        <span>TIMELINE</span>
        <button
          onClick={handleExport}
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
          Export JSON
        </button>
      </div>
      <div style={{ padding: "10px", borderBottom: "2px solid #000000" }}>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "4px 10px",
                background: filter === f ? "#ff6600" : "#ffffff",
                border: "2px solid #000000",
                borderRadius: "0",
                color: filter === f ? "#ffffff" : "#000000",
                cursor: "pointer",
                fontFamily: "DynaPuff, serif",
                fontSize: "11px",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {filteredTimeline.length === 0 ? (
          <div style={{ color: "#999", fontStyle: "italic", textAlign: "center", padding: "20px" }}>
            No events yet
          </div>
        ) : (
          filteredTimeline.slice().reverse().map((event, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                padding: "8px",
                marginBottom: "5px",
                background: idx === hoveredIndex ? "#f0f0f0" : "transparent",
                borderLeft: `3px solid ${
                  event.type === "action" ? "#ff6600" :
                  event.type === "economy" ? "#4CAF50" :
                  event.type === "system" ? "#2196F3" :
                  "#9C27B0"
                }`,
                fontSize: "11px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontWeight: "bold", color: "#ff6600" }}>{event.type.toUpperCase()}</span>
                <span style={{ color: "#666", fontSize: "10px" }}>
                  {hoveredIndex === idx ? formatExactTime(event.ts) : formatRelativeTime(event.ts)}
                </span>
              </div>
              <div>{event.message}</div>
              {Object.keys(event.delta || {}).length > 0 && (
                <div style={{ fontSize: "10px", color: "#666", marginTop: "3px" }}>
                  {Object.entries(event.delta).map(([key, value]) => (
                    <span key={key} style={{ marginRight: "10px" }}>
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
