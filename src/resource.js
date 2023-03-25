export const resources = {
  INVOICE_STATUS: {
    DELIVERED: "delivered",
    REJECTED: "rejected",
    APPROVED: "approved",
    PENDING: "pending",
  },
  CHAT: {
    CUSTOMER_SENDER: "customer",
    MANAGER_SENDER: "manager",
    SOCKET_MESSAGE: {
      CONNECT:"connect",
      SEND_MESSAGE:"SEND_MESSAGE",
      RECEIVE_MESSAGE_BY_CUSTOMER: "RECEIVE_MESSAGE_BY_CUSTOMER",
      RECEIVE_MESSAGE_BY_MANAGER: "RECEIVE_MESSAGE_BY_MANAGER"
    },
  },
  ROUTES: {
    PROFILE: "/profile",
    MANAGE_ITEMS: "/manageItems",
    SELLS_ARCHIVE: "/sellsArchive",
    PURCHASES_REQUESTS: "/purchasesRequests",
    HOME: "/home",
    MANAGE_SHOPS: "/manageShops",
    BRANDS: "/brands",
    CATEGORIES: "/categories",
    SIGN_IN: "/signIn",
    Unknown404: "/404",
  },
  SESSION_STORAGE: {
    TOKEN: "TOKEN",
    mainMenuSelectedKey: "mainMenuSelectedKey",
    mainMenuSelectedTitle: "mainMenuSelectedTitle",
  },
  FAILED_TO_FETCH: {
    ERROR: true,
    ERROR_TYPE: "FAILED_TO_FETCH",
  },
  ERRORS: {
    USER_NOT_AUTHORIZED: {
      ERROR: true,
      ERROR_TYPE: "USER_NOT_AUTHORIZED",
    },
    FAILED_TO_FETCH: {
      ERROR: true,
      ERROR_TYPE: "FAILED_TO_FETCH",
    },
  },
  MAIN_MENU_ITEMS: {
    PROFILE: { PATH_NAME: "/profile", TITLE: "معلومات المحل", KEY: "1" },
    MANAGE_ITEMS: {
      PATH_NAME: "/manageItems",
      TITLE: "ادارة المواد",
      KEY: "2",
    },
    SELLS_ARCHIVE: {
      PATH_NAME: "/sellsArchive",
      TITLE: "ارشيف المبيعات",
      KEY: "4",
    },
    PURCHASES_REQUESTS: {
      PATH_NAME: "/purchasesRequests",
      TITLE: "طلبات الشراء",
      KEY: "3",
    },
    HOME: { PATH_NAME: "/home", TITLE: null, KEY: null },
    MANAGE_SHOPS: {
      PATH_NAME: "/manageShops",
      TITLE: "ادارة المحلات",
      KEY: "8",
    },
    BRANDS: { PATH_NAME: "/brands", TITLE: "الماركات", KEY: "5" },
    CATEGORIES: { PATH_NAME: "/categories", TITLE: "الاصناف", KEY: "6" },
    SIGN_OUT: { PATH_NAME: "/signIn", TITLE: "تسجيل الخروج", KEY: "7" },
    Unknown404: { PATH_NAME: "/404", TITLE: null, KEY: null },
  },
  SHOP_NOTIFICATION: {
    NEW_REQUEST: {
      OP_TITLE: "NEW_REQUEST",
      // OP_DESCRIPTION: "تم استلام طلب شراء جديد",
      // OP_COL_NAME: "id",
    },
    UPDATE_REQUEST: {},
    DELETE_REQUEST: {},
    NEW_REVIEW: {
      OP_TITLE: "NEW_REVIEW",
      // OP_DESCRIPTION: "قام احدهم بتقييم المنتج الخاص بك",
      // OP_COL_NAME: "itemId",
    },
    NEW_CHAT_MESSAGE: {
      OP_TITLE: "NEW_CHAT_MESSAGE",
      // OP_DESCRIPTION: "تم استلام رسالة جديدة",
      // OP_COL_NAME: "invoiceShopId",
    },
  },
  FIREBASE_MESSAGING: {
    VAPID_KEY: "BMCnqG8uUAs51LYLqCb9ENxpWn300mRhHdF5-nFkgDMtbqMsiJnDCPwGJEgli93mSZxCHOf5KUQFTJ_rfsMFNds",
  },
};
