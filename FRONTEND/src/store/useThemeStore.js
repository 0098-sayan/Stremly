import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("streamly-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("streamly-theme", theme);
    set({ theme });
  },
}));