// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase Config based on the prompt
const firebaseConfig = {
  apiKey: "AIzaSyA7nIu3IfO_o3MTY6q3VJBMQGwWxv7uoSI",
  authDomain: "watch-and-earn-coin-d1057.firebaseapp.com",
  databaseURL: "https://watch-and-earn-coin-d1057-default-rtdb.firebaseio.com",
  projectId: "watch-and-earn-coin-d1057",
  storageBucket: "watch-and-earn-coin-d1057.appspot.com",
  messagingSenderId: "918702325552",
  appId: "1:918702325552:web:f88b932d75f0cedada92f5",
  measurementId: "G-Q26P64YWGT"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
