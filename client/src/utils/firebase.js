import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "smartedu-8c002.firebaseapp.com",
  projectId: "smartedu-8c002",
  storageBucket: "smartedu-8c002.firebasestorage.app",
  messagingSenderId: "888002088638",
  appId: "1:888002088638:web:c97073f2968812415c58ef",
};

const hasFirebaseApiKey =
  typeof firebaseConfig.apiKey === "string" &&
  firebaseConfig.apiKey.trim().length > 0 &&
  firebaseConfig.apiKey !== "undefined";

let auth = null;
let provider = null;

if (hasFirebaseApiKey) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
  } catch (error) {
    console.warn("Firebase auth is not available:", error.message);
  }
}

const isGoogleAuthAvailable = Boolean(auth && provider);

export { auth, provider, isGoogleAuthAvailable };
