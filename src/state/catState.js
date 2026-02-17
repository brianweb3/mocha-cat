// Extended Cat State Store with Dispatch/Reducer System
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Initial state
const initialState = {
  meta: {
    id: `cat_${Date.now()}`,
    name: "Mochi",
    createdAt: Date.now(),
    lastUpdated: Date.now(),
    ageMinutes: 0,
    level: 1,
    xp: 0,
    streakDays: 0,
  },
  core: {
    hunger: 100,
    happiness: 100,
    health: 100,
    energy: 100,
  },
  advanced: {
    mood: { label: "Happy", value0to100: 100, trend: "stable" },
    intelligence: 100,
    loyalty: 100,
    cleanliness: 100,
    stress: 0,
    dnaStability: 100,
  },
  inventory: {
    food: { kibble: 5, fish: 3, treat: 2 },
    medicine: { bandage: 2, vitamin: 1 },
    toys: { ball: 1, laser: 1 },
  },
  economy: {
    coins: 100,
    totalEarned: 100,
    totalSpent: 0,
  },
  flags: {
    musicEnabled: true,
    rotationEnabled: false,
    chaosMode: false,
    debugMode: false,
    isSleeping: false,
  },
  timeline: [],
  achievements: {
    unlocked: [],
  },
  analytics: {
    history: {
      ts: [],
      hunger: [],
      happiness: [],
      health: [],
      energy: [],
      mood: [],
    },
  },
  actionCounts: {
    feed: 0,
    play: 0,
    sleep: 0,
    heal: 0,
    clean: 0,
  },
  lastAction: null,
  tickSpeed: 1,
};

// Clamp helper
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Calculate mood from state
const calculateMood = (state) => {
  const { hunger, happiness, health, energy, stress, cleanliness } = {
    ...state.core,
    ...state.advanced,
  };

  let moodValue = (happiness + health + energy) / 3;
  moodValue -= stress * 0.5;
  moodValue = clamp(moodValue, 0, 100);

  let label = "Happy";
  if (hunger < 30) label = "Hungry";
  if (energy < 20) label = "Tired";
  if (health < 30) label = "Sick";
  if (stress > 70) label = "Stressed";
  if (cleanliness < 30) label = "Dirty";
  if (state.flags.isSleeping) label = "Sleepy";
  if (state.flags.chaosMode) label = "Chaotic";
  if (moodValue > 80 && stress < 20) label = "Zen";

  return {
    label,
    value0to100: Math.round(moodValue),
    trend: moodValue > state.advanced.mood.value0to100 ? "up" : moodValue < state.advanced.mood.value0to100 ? "down" : "stable",
  };
};

// Add timeline event
const addTimelineEvent = (state, type, message, delta = {}) => {
  const event = {
    ts: Date.now(),
    type,
    message,
    delta,
  };
  return [...state.timeline.slice(-99), event]; // Keep last 100 events
};

// Update analytics history
const updateAnalytics = (state) => {
  const history = { ...state.analytics.history };
  const now = Date.now();
  
  // Add current point
  history.ts.push(now);
  history.hunger.push(state.core.hunger);
  history.happiness.push(state.core.happiness);
  history.health.push(state.core.health);
  history.energy.push(state.core.energy);
  history.mood.push(state.advanced.mood.value0to100);

  // Keep last 300 points
  const maxPoints = 300;
  Object.keys(history).forEach((key) => {
    if (history[key].length > maxPoints) {
      history[key] = history[key].slice(-maxPoints);
    }
  });

  return history;
};

// Check achievements
const checkAchievements = (state) => {
  const unlocked = [...state.achievements.unlocked];
  const checks = {
    SURVIVOR_24H: state.meta.ageMinutes >= 1440 && !unlocked.includes("SURVIVOR_24H"),
    FEED_100: state.actionCounts.feed >= 100 && !unlocked.includes("FEED_100"),
    RICH: state.economy.coins >= 500 && !unlocked.includes("RICH"),
  };

  Object.keys(checks).forEach((achievement) => {
    if (checks[achievement]) {
      unlocked.push(achievement);
    }
  });

  return unlocked;
};

// Reducer
const reducer = (state, action) => {
  let newState = { ...state };

  switch (action.type) {
    case "TICK": {
      const dt = action.payload?.dt || 1;
      const { isSleeping } = newState.flags;

      // Update core stats
      newState.core.hunger = clamp(newState.core.hunger - (isSleeping ? 0.2 : 0.5) * dt, 0, 100);
      newState.core.energy = clamp(newState.core.energy - (isSleeping ? -0.5 : 0.2) * dt, 0, 100);
      newState.core.happiness = clamp(newState.core.happiness - 0.3 * dt, 0, 100);
      newState.advanced.cleanliness = clamp(newState.advanced.cleanliness - 0.1 * dt, 0, 100);

      // Update stress
      if (newState.core.hunger < 30 || newState.core.energy < 20) {
        newState.advanced.stress = clamp(newState.advanced.stress + 0.5 * dt, 0, 100);
      } else {
        newState.advanced.stress = clamp(newState.advanced.stress - 0.2 * dt, 0, 100);
      }

      // Update health
      if (newState.core.hunger < 20 || newState.core.happiness < 20 || newState.advanced.stress > 70) {
        newState.core.health = clamp(newState.core.health - 0.5 * dt, 0, 100);
      } else if (newState.core.health < 100) {
        newState.core.health = clamp(newState.core.health + 0.1 * dt, 0, 100);
      }

      // Update age
      newState.meta.ageMinutes += dt / 60;
      newState.meta.lastUpdated = Date.now();

      // Update mood
      newState.advanced.mood = calculateMood(newState);

      // Update analytics
      newState.analytics.history = updateAnalytics(newState);

      // Check achievements
      newState.achievements.unlocked = checkAchievements(newState);

      break;
    }

    case "FEED": {
      const item = action.payload?.item || "kibble";
      if (newState.inventory.food[item] <= 0) {
        return { ...state, lastAction: { type: "FEED", success: false, message: `No ${item} available` } };
      }

      newState.inventory.food[item]--;
      newState.core.hunger = clamp(newState.core.hunger + (item === "treat" ? 30 : item === "fish" ? 25 : 20), 0, 100);
      newState.core.happiness = clamp(newState.core.happiness + (item === "treat" ? 15 : 5), 0, 100);
      newState.advanced.cleanliness = clamp(newState.advanced.cleanliness - 2, 0, 100);
      newState.actionCounts.feed++;
      newState.economy.coins += 2;
      newState.economy.totalEarned += 2;
      newState.timeline = addTimelineEvent(newState, "action", `Fed ${item}`, { hunger: "+" + (item === "treat" ? 30 : item === "fish" ? 25 : 20) });
      newState.lastAction = { type: "FEED", success: true, item, timestamp: Date.now() };
      break;
    }

    case "PLAY": {
      if (newState.flags.isSleeping) {
        return { ...state, lastAction: { type: "PLAY", success: false, message: "Cannot play while sleeping" } };
      }
      if (newState.core.energy < 10) {
        return { ...state, lastAction: { type: "PLAY", success: false, message: "Not enough energy" } };
      }

      newState.core.energy = clamp(newState.core.energy - 10, 0, 100);
      newState.core.happiness = clamp(newState.core.happiness + 15, 0, 100);
      newState.advanced.stress = clamp(newState.advanced.stress + 5, 0, 100);
      newState.economy.coins += 5;
      newState.economy.totalEarned += 5;
      newState.meta.xp += 10;
      newState.actionCounts.play++;
      newState.timeline = addTimelineEvent(newState, "action", "Played", { happiness: "+15", energy: "-10" });
      newState.lastAction = { type: "PLAY", success: true, timestamp: Date.now() };
      break;
    }

    case "SLEEP_TOGGLE": {
      newState.flags.isSleeping = !newState.flags.isSleeping;
      newState.timeline = addTimelineEvent(
        newState,
        "action",
        newState.flags.isSleeping ? "Started sleeping" : "Woke up",
        {}
      );
      newState.lastAction = { type: "SLEEP_TOGGLE", success: true, isSleeping: newState.flags.isSleeping, timestamp: Date.now() };
      break;
    }

    case "REST": {
      if (newState.flags.isSleeping) {
        return { ...state, lastAction: { type: "REST", success: false, message: "Cannot rest while sleeping" } };
      }
      
      newState.core.energy = clamp(newState.core.energy + 20, 0, 100);
      newState.core.happiness = clamp(newState.core.happiness + 5, 0, 100);
      newState.advanced.stress = clamp(newState.advanced.stress - 5, 0, 100);
      newState.timeline = addTimelineEvent(newState, "action", "Rested", { energy: "+20", happiness: "+5" });
      newState.lastAction = { type: "REST", success: true, timestamp: Date.now() };
      break;
    }

    case "HEAL": {
      const item = action.payload?.item || "bandage";
      if (newState.inventory.medicine[item] <= 0) {
        return { ...state, lastAction: { type: "HEAL", success: false, message: `No ${item} available` } };
      }

      newState.inventory.medicine[item]--;
      newState.core.health = clamp(newState.core.health + (item === "vitamin" ? 30 : 20), 0, 100);
      newState.advanced.stress = clamp(newState.advanced.stress - 10, 0, 100);
      newState.actionCounts.heal++;
      newState.timeline = addTimelineEvent(newState, "action", `Used ${item}`, { health: "+" + (item === "vitamin" ? 30 : 20) });
      newState.lastAction = { type: "HEAL", success: true, item, timestamp: Date.now() };
      break;
    }

    case "CLEAN": {
      if (newState.core.energy < 5) {
        return { ...state, lastAction: { type: "CLEAN", success: false, message: "Not enough energy" } };
      }

      newState.core.energy = clamp(newState.core.energy - 5, 0, 100);
      newState.advanced.cleanliness = clamp(newState.advanced.cleanliness + 30, 0, 100);
      newState.core.happiness = clamp(newState.core.happiness + 10, 0, 100);
      newState.advanced.stress = clamp(newState.advanced.stress - 15, 0, 100);
      newState.actionCounts.clean++;
      newState.timeline = addTimelineEvent(newState, "action", "Cleaned", { cleanliness: "+30", happiness: "+10" });
      newState.lastAction = { type: "CLEAN", success: true, timestamp: Date.now() };
      break;
    }

    case "TOGGLE_ROTATION": {
      newState.flags.rotationEnabled = !newState.flags.rotationEnabled;
      break;
    }

    case "TOGGLE_MUSIC": {
      newState.flags.musicEnabled = !newState.flags.musicEnabled;
      break;
    }

    case "TOGGLE_CHAOS": {
      newState.flags.chaosMode = !newState.flags.chaosMode;
      break;
    }

    case "TOGGLE_DEBUG": {
      newState.flags.debugMode = !newState.flags.debugMode;
      break;
    }

    case "SET_TICK_SPEED": {
      newState.tickSpeed = clamp(action.payload?.speed || 1, 1, 5);
      break;
    }

    case "BUY_ITEM": {
      const { category, item, price } = action.payload;
      if (newState.economy.coins < price) {
        return { ...state, lastAction: { type: "BUY_ITEM", success: false, message: "Not enough coins" } };
      }

      newState.economy.coins -= price;
      newState.economy.totalSpent += price;
      newState.inventory[category][item]++;
      newState.timeline = addTimelineEvent(newState, "economy", `Bought ${item}`, { coins: `-${price}` });
      newState.lastAction = { type: "BUY_ITEM", success: true, item, price, timestamp: Date.now() };
      break;
    }

    case "RANDOM_EVENT": {
      const events = [
        { type: "coin", message: "Found a coin!", delta: { coins: "+10" }, coins: 10 },
        { type: "sick", message: "Got sick!", delta: { health: "-10", stress: "+20" }, health: -10, stress: 20 },
        { type: "nap", message: "Cute nap!", delta: { energy: "+20", happiness: "+10" }, energy: 20, happiness: 10 },
        { type: "glitch", message: "Glitch!", delta: {}, mood: "Chaotic" },
      ];
      const event = events[Math.floor(Math.random() * events.length)];

      if (event.coins) newState.economy.coins += event.coins;
      if (event.health) newState.core.health = clamp(newState.core.health + event.health, 0, 100);
      if (event.stress) newState.advanced.stress = clamp(newState.advanced.stress + event.stress, 0, 100);
      if (event.energy) newState.core.energy = clamp(newState.core.energy + event.energy, 0, 100);
      if (event.happiness) newState.core.happiness = clamp(newState.core.happiness + event.happiness, 0, 100);
      if (event.mood) newState.advanced.mood.label = event.mood;

      newState.timeline = addTimelineEvent(newState, "system", event.message, event.delta);
      break;
    }

    case "RESET_SAVE": {
      return { ...initialState, meta: { ...initialState.meta, id: `cat_${Date.now()}`, createdAt: Date.now() } };
    }

    case "CLEAR_ANALYTICS": {
      newState.analytics.history = {
        ts: [],
        hunger: [],
        happiness: [],
        health: [],
        energy: [],
        mood: [],
      };
      break;
    }

    case "CHAT": {
      const message = action.payload?.message || "";
      const response = generateChatResponse(newState, message);
      newState.timeline = addTimelineEvent(newState, "chat", `You: ${message}`, {});
      newState.timeline = addTimelineEvent(newState, "chat", `Cat: ${response}`, {});
      break;
    }

    default:
      return state;
  }

  // Update mood after any action
  newState.advanced.mood = calculateMood(newState);
  newState.meta.lastUpdated = Date.now();

  return newState;
};

// Generate chat response
const generateChatResponse = (state, userMessage) => {
  const { hunger, happiness, health, energy } = state.core;
  const { stress, cleanliness } = state.advanced;
  const msg = userMessage.toLowerCase();

  if (hunger < 30) return "Meow... I'm hungry!";
  if (energy < 20) return "Zzz... I'm tired...";
  if (health < 30) return "Meow... I don't feel well...";
  if (stress > 70) return "Meow meow! Too stressed!";
  if (cleanliness < 30) return "Meow! I need a bath!";
  if (msg.includes("hello") || msg.includes("hi")) return "Meow! Hello!";
  if (msg.includes("love") || msg.includes("like")) return "Purr purr! I love you too!";
  if (msg.includes("play")) return "Meow! Let's play!";
  if (msg.includes("food") || msg.includes("eat")) return "Meow! I want food!";
  if (state.flags.isSleeping) return "Zzz... sleeping...";
  if (happiness > 80) return "Purr! I'm so happy!";
  return "Meow?";
};

// Create store with Zustand
export const useCatStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Dispatch function
      dispatch: (action) => {
        const currentState = get();
        // Remove functions before reducer
        const { dispatch: _, getState: __, ...pureState } = currentState;
        const newState = reducer(pureState, action);
        set(newState);
        return newState;
      },

      // Helper getters
      getState: () => {
        const state = get();
        // Remove dispatch and getState from returned state
        const { dispatch: _, getState: __, ...pureState } = state;
        return pureState;
      },
    }),
    {
      name: "tamagotchi-cat-state",
      version: 2,
      partialize: (state) => {
        // Only persist state, not functions
        const { dispatch, getState, ...persisted } = state;
        return persisted;
      },
      onRehydrateStorage: () => (state) => {
        // Ensure all stats are at maximum on load
        if (state) {
          state.core.hunger = 100;
          state.core.happiness = 100;
          state.core.health = 100;
          state.core.energy = 100;
          state.advanced.cleanliness = 100;
          state.advanced.mood.value0to100 = 100;
          state.advanced.stress = 0;
          state.advanced.intelligence = 100;
          state.advanced.loyalty = 100;
          state.advanced.dnaStability = 100;
        }
      },
    }
  )
);
