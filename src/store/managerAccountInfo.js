import create from "zustand";

export const ManagerAccountInfo = create(set => ({
  accountInfo: {
    username: null,
    password: null,
    shopId: null,
  },
  setAccountInfo: (accountInfo) => set({ accountInfo })
}));
