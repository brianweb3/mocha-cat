import { create } from "zustand";

export const useTamagotchiStore = create((set) => ({
  theme: "mocha", // Theme par défaut
  autoRotate: false,

  textures: {
    main: "./textures/cat/cat_main.png",
    screen: "./textures/cat/cat",
    sleep: "./textures/cat/sleep/cat-sleep",
    eat: "./textures/cat/eat/cat-eat",
    ring: "#8B5A2B",
    button: "#FFFFFF",
  },

  logoUrl: "./logos/logo-mocha.png",
  frameCount: 26,
  bgUrl: "./backgrounds/bg-mocha.png",

  // Характеристики тамагочи
  stats: {
    hunger: 100, // Голод (0-100)
    happiness: 100, // Счастье (0-100)
    health: 100, // Здоровье (0-100)
    energy: 100, // Энергия (0-100)
  },

  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),

  // Функции для изменения характеристик
  feed: () => set((state) => ({
    stats: {
      ...state.stats,
      hunger: Math.min(100, state.stats.hunger + 20),
      happiness: Math.min(100, state.stats.happiness + 5),
    }
  })),

  play: () => set((state) => ({
    stats: {
      ...state.stats,
      happiness: Math.min(100, state.stats.happiness + 15),
      energy: Math.max(0, state.stats.energy - 10),
    }
  })),

  sleep: () => set((state) => ({
    stats: {
      ...state.stats,
      energy: Math.min(100, state.stats.energy + 30),
      health: Math.min(100, state.stats.health + 5),
    }
  })),

  heal: () => set((state) => ({
    stats: {
      ...state.stats,
      health: Math.min(100, state.stats.health + 20),
    }
  })),

  // Уменьшение характеристик со временем
  decreaseStats: () => set((state) => ({
    stats: {
      hunger: Math.max(0, state.stats.hunger - 0.5),
      happiness: Math.max(0, state.stats.happiness - 0.3),
      energy: Math.max(0, state.stats.energy - 0.2),
      health: state.stats.hunger < 20 || state.stats.happiness < 20 
        ? Math.max(0, state.stats.health - 0.5)
        : state.stats.health,
    }
  })),

  setTheme: (theme) => {
    const themes = {
      mocha: {
        main: "./textures/cat/cat_main.png",
        screen: "./textures/cat/cat",
        sleep: "./textures/cat/sleep/cat-sleep",
        eat: "./textures/cat/eat/cat-eat",
        frameCount: 26,
        ring: "#8B5A2B",
        button: "#FFFFFF",
        logo: "./logos/logo-mocha.png",
        background: "./backgrounds/bg-mocha.png",
      },
      egg: {
        main: "./textures/egg/egg_main.png",
        screen: "./textures/egg/egg",
        sleep: "./textures/egg/sleep/egg-sleep",
        eat: "./textures/egg/eat/egg-eat",
        frameCount: 26,
        ring: "#FFE5B4",
        button: "#FFFFFF",
        logo: "./logos/logo-egg.png",
        background: "./backgrounds/bg-egg.png",
      },
      fruty: {
        main: "./textures/fruty/fruty_main.png",
        screen: "./textures/fruty/fruty",
        sleep: "./textures/fruty/sleep/fruty-sleep",
        eat: "./textures/fruty/eat/fruty-eat",
        frameCount: 26,
        ring: "#FF6B9D",
        button: "#FFFFFF",
        logo: "./logos/logo-fruty.png",
        background: "./backgrounds/bg-fruty.png",
      },
      tea: {
        main: "./textures/tea/tea_main.png",
        screen: "./textures/tea/tea",
        sleep: "./textures/tea/sleep/tea-sleep",
        eat: "./textures/tea/eat/tea-eat",
        frameCount: 26,
        ring: "#C8E6C9",
        button: "#FFFFFF",
        logo: "./logos/logo-tea.png",
        background: "./backgrounds/bg-tea.png",
      },
    };

    if (themes[theme]) {
      set({
        theme,
        textures: {
          main: themes[theme].main,
          screen: themes[theme].screen,
          sleep: themes[theme].sleep,
          eat: themes[theme].eat,
          ring: themes[theme].ring,
          button: themes[theme].button,
        },
        logoUrl: themes[theme].logo,
        frameCount: themes[theme].frameCount,
        bgUrl: themes[theme].background,
      });
    } else {
      console.warn(`⚠️ Thème inconnu : ${theme}`);
    }
  },

  
}));
