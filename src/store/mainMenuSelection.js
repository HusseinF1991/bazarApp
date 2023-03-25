import create from "zustand";

export const MainMenuSelection = create((set) => ({
  selectedItemInfo: {
    key: null,
    title: null,
  },
  setSelectedItemInfo: (selectedItemInfo) => set({ selectedItemInfo }),
}));
