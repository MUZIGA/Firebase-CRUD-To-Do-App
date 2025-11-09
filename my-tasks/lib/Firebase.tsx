// app/Lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSy....", 
  authDomain: "crud-to-do-list-38650.firebaseapp.com",
  projectId: "crud-to-do-list-38650",
  storageBucket: "crud-to-do-list-38650.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "XXXXXXX",
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
