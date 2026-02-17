import { useState, useEffect } from "react";
import { useCatStore } from "../../state/catState";
import { showToast } from "../../utils/toast";

export default function ActionsPanel() {
  const { dispatch, getState } = useCatStore();
  const [state, setState] = useState(getState());

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getState());
    }, 500);
    return () => clearInterval(interval);
  }, []);
  const [feedMenuOpen, setFeedMenuOpen] = useState(false);
  const [healMenuOpen, setHealMenuOpen] = useState(false);

  const handleFeed = (item) => {
    const result = dispatch({ type: "FEED", payload: { item } });
    if (result.lastAction?.success) {
      showToast(`Fed ${item}!`, "success");
    } else {
      showToast(result.lastAction?.message || "Cannot feed", "error");
    }
    setFeedMenuOpen(false);
  };

  const handlePlay = () => {
    const result = dispatch({ type: "PLAY" });
    if (result.lastAction?.success) {
      showToast("Played!", "success");
    } else {
      showToast(result.lastAction?.message || "Cannot play", "error");
    }
  };

  const handleSleep = () => {
    dispatch({ type: "SLEEP_TOGGLE" });
    showToast(state.flags.isSleeping ? "Woke up!" : "Sleeping...", "info");
  };

  const handleHeal = (item) => {
    const result = dispatch({ type: "HEAL", payload: { item } });
    if (result.lastAction?.success) {
      showToast(`Used ${item}!`, "success");
    } else {
      showToast(result.lastAction?.message || "Cannot heal", "error");
    }
    setHealMenuOpen(false);
  };

  const handleClean = () => {
    const result = dispatch({ type: "CLEAN" });
    if (result.lastAction?.success) {
      showToast("Cleaned!", "success");
    } else {
      showToast(result.lastAction?.message || "Cannot clean", "error");
    }
  };

  const isDisabled = (action) => {
    if (action === "PLAY" || action === "CLEAN") {
      return state.flags.isSleeping || state.core.energy < (action === "CLEAN" ? 5 : 10);
    }
    return false;
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "4px solid #000000",
        padding: "0",
        borderRadius: "0",
        maxHeight: "350px",
        overflowY: "auto",
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
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        ACTIONS
      </div>
      <div style={{ padding: "20px" }}>
        {/* Feed Button with Dropdown */}
        <div style={{ marginBottom: "10px", position: "relative" }}>
          <button
            onClick={() => setFeedMenuOpen(!feedMenuOpen)}
            disabled={state.flags.isSleeping}
            style={{
              width: "100%",
              padding: "10px",
              background: state.flags.isSleeping ? "#f0f0f0" : "#ffffff",
              border: "2px solid #000000",
              borderRadius: "0",
              color: state.flags.isSleeping ? "#999" : "#000000",
              cursor: state.flags.isSleeping ? "not-allowed" : "pointer",
              fontFamily: "DynaPuff, serif",
              fontSize: "14px",
            }}
          >
            Feed {feedMenuOpen ? "▲" : "▼"}
          </button>
          {feedMenuOpen && !state.flags.isSleeping && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#ffffff",
                border: "2px solid #000000",
                borderTop: "none",
                zIndex: 100,
              }}
            >
              {Object.entries(state.inventory.food).map(([item, count]) => (
                <button
                  key={item}
                  onClick={() => handleFeed(item)}
                  disabled={count <= 0}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: count <= 0 ? "#f0f0f0" : "#ffffff",
                    border: "none",
                    borderBottom: "1px solid #000000",
                    color: count <= 0 ? "#999" : "#000000",
                    cursor: count <= 0 ? "not-allowed" : "pointer",
                    textAlign: "left",
                    fontFamily: "DynaPuff, serif",
                  }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)} ({count})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Play Button */}
        <button
          onClick={handlePlay}
          disabled={isDisabled("PLAY")}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            background: isDisabled("PLAY") ? "#f0f0f0" : "#ffffff",
            border: "2px solid #000000",
            borderRadius: "0",
            color: isDisabled("PLAY") ? "#999" : "#000000",
            cursor: isDisabled("PLAY") ? "not-allowed" : "pointer",
            fontFamily: "DynaPuff, serif",
            fontSize: "14px",
          }}
        >
          Play
        </button>

        {/* Sleep Toggle */}
        <button
          onClick={handleSleep}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            background: state.flags.isSleeping ? "#ff6600" : "#ffffff",
            border: "2px solid #000000",
            borderRadius: "0",
            color: state.flags.isSleeping ? "#ffffff" : "#000000",
            cursor: "pointer",
            fontFamily: "DynaPuff, serif",
            fontSize: "14px",
          }}
        >
          {state.flags.isSleeping ? "Wake Up" : "Sleep"}
        </button>

        {/* Heal Button with Dropdown */}
        <div style={{ marginBottom: "10px", position: "relative" }}>
          <button
            onClick={() => setHealMenuOpen(!healMenuOpen)}
            style={{
              width: "100%",
              padding: "10px",
              background: "#ffffff",
              border: "2px solid #000000",
              borderRadius: "0",
              color: "#000000",
              cursor: "pointer",
              fontFamily: "DynaPuff, serif",
              fontSize: "14px",
            }}
          >
            Heal {healMenuOpen ? "▲" : "▼"}
          </button>
          {healMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#ffffff",
                border: "2px solid #000000",
                borderTop: "none",
                zIndex: 100,
              }}
            >
              {Object.entries(state.inventory.medicine).map(([item, count]) => (
                <button
                  key={item}
                  onClick={() => handleHeal(item)}
                  disabled={count <= 0}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: count <= 0 ? "#f0f0f0" : "#ffffff",
                    border: "none",
                    borderBottom: "1px solid #000000",
                    color: count <= 0 ? "#999" : "#000000",
                    cursor: count <= 0 ? "not-allowed" : "pointer",
                    textAlign: "left",
                    fontFamily: "DynaPuff, serif",
                  }}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)} ({count})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clean Button */}
        <button
          onClick={handleClean}
          disabled={isDisabled("CLEAN")}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            background: isDisabled("CLEAN") ? "#f0f0f0" : "#ffffff",
            border: "2px solid #000000",
            borderRadius: "0",
            color: isDisabled("CLEAN") ? "#999" : "#000000",
            cursor: isDisabled("CLEAN") ? "not-allowed" : "pointer",
            fontFamily: "DynaPuff, serif",
            fontSize: "14px",
          }}
        >
          Clean
        </button>

        {/* Last Action */}
        {state.lastAction && (
          <div
            style={{
              marginTop: "15px",
              paddingTop: "10px",
              borderTop: "2px solid #000000",
              fontSize: "11px",
              color: "#666",
            }}
          >
            Last: {state.lastAction.type}
            {state.lastAction.item && ` (${state.lastAction.item})`}
          </div>
        )}
      </div>
    </div>
  );
}
