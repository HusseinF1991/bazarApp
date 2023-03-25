import create from "zustand";

export const SocketObject = create((set) => ({
  socketObj: null,
  setSocketObj: (socketObj) => set({ socketObj }),
}));
