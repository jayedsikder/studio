
import { initializeApp, getApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore"; // Uncomment if you need Firestore
// import { getStorage } from "firebase/storage"; // Uncomment if you need Storage

// Your web app's Firebase configuration
// IMPORTANT: Replace these with your actual Firebase project configuration values.
// It's highly recommended to use environment variables for these.
// Example .env.local file:
// NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
// NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
// NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
// const db = getFirestore(app); // Uncomment if you need Firestore
// const storage = getStorage(app); // Uncomment if you need Storage

export { app, auth /*, db, storage */ };
