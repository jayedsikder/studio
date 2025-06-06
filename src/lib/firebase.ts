
import { initializeApp, getApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore"; // Uncomment if you need Firestore
// import { getStorage } from "firebase/storage"; // Uncomment if you need Storage

// Your web app's Firebase configuration
// These values are from your Firebase project settings.
// It's HIGHLY RECOMMENDED to use environment variables for these sensitive values for production.
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

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBALgOLUsJDhLOtGEguXyScIpPSEfv-ac",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "sample-firebase-ai-app-5fdcf.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sample-firebase-ai-app-5fdcf",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sample-firebase-ai-app-5fdcf.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1073114565964",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1073114565964:web:2becb166d6351114c093e9",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Basic check to ensure critical Firebase config values are present (either from env or fallback)
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error(
    "Firebase configuration is missing critical values (apiKey, authDomain, projectId). " +
    "Please ensure they are set in your environment variables or directly in `src/lib/firebase.ts`. " +
    "Firebase features will not work correctly until this is done."
  );
}


const auth = getAuth(app);
// const db = getFirestore(app); // Uncomment if you need Firestore
// const storage = getStorage(app); // Uncomment if you need Storage

export { app, auth /*, db, storage */ };
