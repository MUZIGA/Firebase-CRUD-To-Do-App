
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXhUtzCa2MkJ0aKcZj4oamPQILGLTXQ7Y",
  authDomain: "authentication-400ff.firebaseapp.com",
  projectId: "authentication-400ff",
  storageBucket: "authentication-400ff.firebasestorage.app",
  messagingSenderId: "272127600459",
  appId: "1:272127600459:web:e760b836af7957e195eace",
  measurementId: "G-14XWW01JXT"
};

if (!firebaseConfig.apiKey) {
  throw new Error(
    "Missing Firebase configuration. Check your NEXT_PUBLIC_FIREBASE_* environment variables."
  );
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);