import create from "zustand";

export const ManagerAccountInfo = create((set) => ({
  accountInfo: {
    managerId: null,
    username: null,
    password: null,
    shopId: null,
    shopLogo: null,
    shopName: null,
    token: null,
  },
  setAccountInfo: (accountInfo) => set({ accountInfo }),
}));
