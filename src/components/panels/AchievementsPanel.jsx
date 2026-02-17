import { useState, useEffect } from "react";
import { useCatStore } from "../../state/catState";

const ACHIEVEMENTS = {
  SURVIVOR_24H: {
    name: "Survivor",
    description: "Survive for 24 hours",
  },
  FEED_100: {
    name: "Feeder",
    description: "Feed 100 times",
  },
  RICH: {
    name: "Rich",
    description: "Have 500 coins",
  },
  CLEAN_FREAK: {
    name: "Clean Freak",
    description: "Keep cleanliness above 90 for 10 minutes",
  },
  ZEN_MASTER: {
    name: "Zen Master",
    description: "Keep stress below 10 for 5 minutes",
  },
};

export default function AchievementsPanel() {
  const { getState } = useCatStore();
  const [state, setState] = useState(getState());
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getState());
    }, 1000);
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
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        ACHIEVEMENTS
      </div>
      <div style={{ padding: "15px", boxSizing: "border-box" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "8px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
            const isUnlocked = state.achievements.unlocked.includes(key);
            return (
              <div
                key={key}
                onClick={() => setSelectedAchievement(selectedAchievement === key ? null : key)}
                style={{
                  padding: "10px",
                  background: isUnlocked ? "#ffffff" : "#f0f0f0",
                  border: "2px solid #000000",
                  cursor: isUnlocked ? "pointer" : "default",
                  opacity: isUnlocked ? 1 : 0.5,
                  textAlign: "center",
                  boxSizing: "border-box",
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "3px", wordBreak: "break-word" }}>
                  {achievement.name}
                </div>
                {selectedAchievement === key && (
                  <div style={{ fontSize: "9px", color: "#666", marginTop: "3px", wordBreak: "break-word" }}>
                    {achievement.description}
                  </div>
                )}
                {!isUnlocked && (
                  <div style={{ fontSize: "10px", marginTop: "3px", color: "#999" }}>LOCKED</div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "2px solid #000000", fontSize: "11px", textAlign: "center", color: "#666" }}>
          Unlocked: {state.achievements.unlocked.length} / {Object.keys(ACHIEVEMENTS).length}
        </div>
      </div>
    </div>
  );
}
