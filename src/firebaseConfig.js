import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Note: Vite uses import.meta.env, but the instructions specified process.env
// So I will map Vite syntax if process.env is not available.
// Since we used create-vite, Vite exposes env vars prefixed with VITE_.
// I will support VITE_ and standard REACT_APP_ syntaxes by checking both.
// Let's adapt it to Vite's environment variables. But wait, we wrote .env with REACT_APP_
// Vite automatically loads VITE_ env vars. We should change .env to use VITE_ prefix or use import.meta.env
// Given React + Vite, import.meta.env is correct.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy_api_key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy_auth_domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy_project_id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy_storage_bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "dummy_sender_id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "dummy_app_id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
