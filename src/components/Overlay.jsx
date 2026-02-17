import { useState, useEffect } from "react";
import { useCatStore } from "../state/catState";
import { useTamagotchiStore } from "../store";
import { showToast, initToast } from "../utils/toast";
import "../style.css";

import InventoryPanel from "./panels/InventoryPanel";
import MoodBrainPanel from "./panels/MoodBrainPanel";
import TimelinePanel from "./panels/TimelinePanel";
import AnalyticsPanel from "./panels/AnalyticsPanel";
import AchievementsPanel from "./panels/AchievementsPanel";
import SettingsPanel from "./panels/SettingsPanel";
import ChatPanel from "./ChatPanel";

export default function Overlay() {
  const { dispatch, getState } = useCatStore();
  const { setTheme, logoUrl } = useTamagotchiStore();
  const [state, setState] = useState(getState());
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState("timeline");
  const [activeLeftTab, setActiveLeftTab] = useState("mood");
  const [audio] = useState(() => {
    const sound = new Audio("./sounds/music.mp3");
    sound.loop = true;
    return sound;
  });

  useEffect(() => {
    initToast();
    // Start music if enabled by default
    if (state.flags.musicEnabled) {
      audio.play().catch(() => {});
      setIsMusicPlaying(true);
    }
  }, []);

  useEffect(() => {
    const { rotationEnabled } = state.flags;
    const oldStore = useTamagotchiStore.getState();
    if (rotationEnabled !== oldStore.autoRotate) {
      if (rotationEnabled && !oldStore.autoRotate) {
        oldStore.toggleAutoRotate();
      } else if (!rotationEnabled && oldStore.autoRotate) {
        oldStore.toggleAutoRotate();
      }
    }
  }, [state.flags.rotationEnabled]);

  useEffect(() => {
    if (state.flags.musicEnabled && !isMusicPlaying) {
      audio.play().catch(() => {});
      setIsMusicPlaying(true);
    } else if (!state.flags.musicEnabled && isMusicPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsMusicPlaying(false);
    }
  }, [state.flags.musicEnabled]);

  useEffect(() => {
    const tickInterval = setInterval(() => {
      const currentState = getState();
      const dt = currentState.tickSpeed;
      dispatch({ type: "TICK", payload: { dt } });
      setState(getState());

      if (currentState.flags.chaosMode || Math.random() < 0.01) {
        dispatch({ type: "RANDOM_EVENT" });
        setState(getState());
      }
    }, 1000);

    return () => clearInterval(tickInterval);
  }, []);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      dispatch({ type: "TICK", payload: { dt: 0 } });
    }, 10000);

    return () => clearInterval(saveInterval);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") return;

      switch (event.key.toLowerCase()) {
        case "f":
          const foodItems = Object.keys(state.inventory.food).filter(
            (item) => state.inventory.food[item] > 0
          );
          if (foodItems.length > 0) {
            dispatch({ type: "FEED", payload: { item: foodItems[0] } });
            showToast(`Fed ${foodItems[0]}!`, "success");
          } else {
            showToast("No food available", "error");
          }
          break;
        case "p":
          if (!state.flags.isSleeping && state.core.energy >= 10) {
            dispatch({ type: "PLAY" });
            showToast("Played!", "success");
          }
          break;
        case "s":
          dispatch({ type: "SLEEP_TOGGLE" });
          showToast(state.flags.isSleeping ? "Woke up!" : "Sleeping...", "info");
          break;
        case "h":
          const medItems = Object.keys(state.inventory.medicine).filter(
            (item) => state.inventory.medicine[item] > 0
          );
          if (medItems.length > 0) {
            dispatch({ type: "HEAL", payload: { item: medItems[0] } });
            showToast(`Used ${medItems[0]}!`, "success");
          } else {
            showToast("No medicine available", "error");
          }
          break;
        case "c":
          if (!state.flags.isSleeping && state.core.energy >= 5) {
            dispatch({ type: "CLEAN" });
            showToast("Cleaned!", "success");
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [state]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setState(getState());
    }, 1000);
    return () => clearInterval(updateInterval);
  }, []);

  const getBarColor = (value) => {
    if (value >= 70) return "#4CAF50";
    if (value >= 40) return "#FFC107";
    return "#F44336";
  };

  const rightTabs = [
    { key: "timeline", label: "Timeline" },
    { key: "analytics", label: "Analytics" },
    { key: "settings", label: "Settings" },
    { key: "achievements", label: "Achievements" },
  ];

  const handleCopyCA = () => {
    const ca = "ExWWPjURDHemTh8PS6vuKB17bDj9Z6nA9z2uKV8Kpump";
    navigator.clipboard.writeText(ca).then(() => {
      showToast("CA copied to clipboard!", "success");
    }).catch(() => {
      showToast("Failed to copy", "error");
    });
  };

  const handleToggleMusic = () => {
    dispatch({ type: "TOGGLE_MUSIC" });
    showToast(state.flags.musicEnabled ? "Music on" : "Music off", "info");
  };

  return (
    <div className="overlay">
      {/* ===== TOP LINKS PANEL ===== */}
      <div className="top-links-panel">
        <a 
          href="https://x.com/mochacatplay" 
          target="_blank" 
          rel="noopener noreferrer"
          className="top-link-button"
        >
          X
        </a>
        <a 
          href="https://pump.fun/coin/ExWWPjURDHemTh8PS6vuKB17bDj9Z6nA9z2uKV8Kpump" 
          target="_blank" 
          rel="noopener noreferrer"
          className="top-link-button"
        >
          Pumpfun
        </a>
        <button 
          onClick={handleCopyCA}
          className="top-link-button top-link-button--copy"
        >
          Copy CA
        </button>
        <button 
          onClick={handleToggleMusic}
          className={`top-link-button top-link-button--sound ${state.flags.musicEnabled ? "top-link-button--sound-on" : ""}`}
        >
          {state.flags.musicEnabled ? "🔊" : "🔇"}
        </button>
      </div>
      
      {/* ===== LEFT COLUMN ===== */}
      <div className="overlay-column overlay-left">
        {/* CAT STATS Panel */}
        <div className="panel">
          <h3 className="panel-header">CAT STATS</h3>
          <div style={{ padding: "15px" }}>
            {[
              { label: "Hunger", key: "hunger" },
              { label: "Happiness", key: "happiness" },
              { label: "Health", key: "health" },
              { label: "Energy", key: "energy" },
            ].map(({ label, key }) => (
              <div key={key} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "13px" }}>
                  <span>{label}:</span>
                  <span style={{ color: "#ff6600", fontWeight: "bold" }}>
                    {Math.round(state.core[key])}/100
                  </span>
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
                      width: `${state.core[key]}%`,
                      height: "100%",
                      background: getBarColor(state.core[key]),
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            ))}

            <div
              style={{
                fontSize: "11px",
                borderTop: "2px solid #000000",
                paddingTop: "8px",
                marginTop: "10px",
              }}
            >
              <div>F - Feed | P - Play | S - Sleep</div>
              <div>H - Heal | C - Clean</div>
            </div>
          </div>
        </div>

        {/* Mood & Inventory Tabs */}
        <div className="left-tabs-container">
          <div className="left-tabs">
            <button
              className={`left-tab ${activeLeftTab === "mood" ? "left-tab--active" : ""}`}
              onClick={() => setActiveLeftTab("mood")}
            >
              Mood & Brain
            </button>
            <button
              className={`left-tab ${activeLeftTab === "inventory" ? "left-tab--active" : ""}`}
              onClick={() => setActiveLeftTab("inventory")}
            >
              Inventory
            </button>
          </div>
          <div className="left-tab-content">
            {activeLeftTab === "mood" && <MoodBrainPanel />}
            {activeLeftTab === "inventory" && <InventoryPanel />}
          </div>
        </div>
      </div>

      {/* ===== RIGHT COLUMN WITH TABS ===== */}
      <div className="overlay-column overlay-right">
        <div className="right-tabs-container">
          <div className="right-tabs">
            {rightTabs.map((tab) => (
              <button
                key={tab.key}
                className={`right-tab ${activeRightTab === tab.key ? "right-tab--active" : ""}`}
                onClick={() => setActiveRightTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="right-tab-content">
            {activeRightTab === "timeline" && <TimelinePanel />}
            {activeRightTab === "analytics" && <AnalyticsPanel />}
            {activeRightTab === "settings" && <SettingsPanel />}
            {activeRightTab === "achievements" && <AchievementsPanel />}
          </div>
        </div>
      </div>

      {/* ===== CHAT PANEL - BOTTOM CENTER ===== */}
      <ChatPanel />
    </div>
  );
}
