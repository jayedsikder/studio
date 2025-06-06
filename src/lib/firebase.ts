
import { initializeApp, getApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore"; // Uncomment if you need Firestore
// import { getStorage } from "firebase/storage"; // Uncomment if you need Storage

// Your web app's Firebase configuration
// IMPORTANT: Replace these with your actual Firebase project configuration values.
// You can find these in your Firebase project settings:
// Project Overview (gear icon) > Project settings > General tab > Your apps > Web app SDK configuration.
//
// It's HIGHLY RECOMMENDED to use environment variables for these sensitive values.
// 1. Create a `.env.local` file in the root of your project (if it doesn't exist).
// 2. Add your Firebase config values to `.env.local` like this:
//    NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
//    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
//    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
//    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
//    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
//    NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
// 3. Make sure `.env.local` is listed in your `.gitignore` file.
// 4. Restart your Next.js development server after creating/modifying `.env.local`.

const PLACEHOLDER_API_KEY = "MUST_REPLACE_WITH_YOUR_FIREBASE_API_KEY";
const PLACEHOLDER_AUTH_DOMAIN = "MUST_REPLACE_WITH_YOUR_FIREBASE_AUTH_DOMAIN";
const PLACEHOLDER_PROJECT_ID = "MUST_REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID";
const PLACEHOLDER_STORAGE_BUCKET = "MUST_REPLACE_WITH_YOUR_FIREBASE_STORAGE_BUCKET";
const PLACEHOLDER_MESSAGING_SENDER_ID = "MUST_REPLACE_WITH_YOUR_FIREBASE_MESSAGING_SENDER_ID";
const PLACEHOLDER_APP_ID = "MUST_REPLACE_WITH_YOUR_FIREBASE_APP_ID";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || PLACEHOLDER_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || PLACEHOLDER_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || PLACEHOLDER_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || PLACEHOLDER_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || PLACEHOLDER_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || PLACEHOLDER_APP_ID,
};

// Check if placeholder values are being used and warn the developer
if (firebaseConfig.apiKey === PLACEHOLDER_API_KEY || 
    firebaseConfig.authDomain === PLACEHOLDER_AUTH_DOMAIN ||
    firebaseConfig.projectId === PLACEHOLDER_PROJECT_ID) {
  console.warn(
    "Firebase configuration is using placeholder values. " +
    "Please update `src/lib/firebase.ts` with your actual Firebase project credentials, " +
    "or set them up using environment variables in a `.env.local` file. " +
    "Firebase features will not work correctly until this is done. " +
    "See comments in `src/lib/firebase.ts` for more details."
  );
}


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
