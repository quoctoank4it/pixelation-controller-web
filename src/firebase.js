import { getApps, initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCaNitHpE7NbD8TryQgT-nBg0k5qlTlTMQ",
  authDomain: "pixelationcontroller.firebaseapp.com",
  projectId: "pixelationcontroller",
  storageBucket: "pixelationcontroller.firebasestorage.app",
  messagingSenderId: "102762349077",
  appId: "1:102762349077:web:663fda9a4808e8e09a441c",
  databaseURL: "https://pixelationcontroller-default-rtdb.firebaseio.com/",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const messaging = getMessaging(app);
const database = getDatabase(app);

export { messaging, database };
