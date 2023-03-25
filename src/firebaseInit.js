// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { onMessage, getToken, getMessaging, deleteToken } from "firebase/messaging";
import { resources } from "./resource";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqZQc2DywloONAmcBOwLS93kMk43yD9mA",
  authDomain: "bazarapp-9456d.firebaseapp.com",
  projectId: "bazarapp-9456d",
  storageBucket: "bazarapp-9456d.appspot.com",
  messagingSenderId: "948624149967",
  appId: "1:948624149967:web:1b53d64c36df508f3c16ba",
  measurementId: "G-STP8S72L75",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export const getMyToken = async (setTokenFound) => {
  let currentToken = "";

  try {
    currentToken = await getToken(messaging, {
      vapidKey: resources.FIREBASE_MESSAGING.VAPID_KEY,
    });
    return currentToken;
    //   console.log(currentToken);
    //   if(currentToken){
    //   }
    //   else{

    //   }
  } catch (error) {
    console.log("an error occured while retiriving token : ", error);
    return null;
  }
};

export const deleteMyToken = async () => {

  try {
    let response = await deleteToken(messaging, {
      vapidKey: resources.FIREBASE_MESSAGING.VAPID_KEY,
    });
    return response;
    //   console.log(currentToken);
    //   if(currentToken){
    //   }
    //   else{

    //   }
  } catch (error) {
    console.log("an error occured while deleting token : ", error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage((payload) => {
      resolve(payload);
    });
  });
