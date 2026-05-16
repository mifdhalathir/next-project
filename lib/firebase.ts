import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log Debugging (Hanya terlihat di F12 Console browser)
if (typeof window !== "undefined") {
  console.log("🛠️ Memeriksa Konfigurasi Firebase...");
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "undefined") {
    console.error("❌ ERROR: API Key Firebase tidak terbaca! Cek Environment Variables di Vercel.");
  } else {
    console.log("✅ API Key terdeteksi.");
  }
}

// Initialize Firebase only if all required config keys are present
const isConfigValid =
  !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";

let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isConfigValid) {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
  } catch (e) {
    console.error("❌ Firebase initialization failed:", e);
  }
}

export { auth, googleProvider };
