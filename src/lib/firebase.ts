
import { initializeApp, getApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore"; // Uncomment if you need Firestore
// import { getStorage } from "firebase/storage"; // Uncomment if you need Storage

// These are the values from your Firebase project settings.
// Environment variables (e.g., in .env.local) will take precedence if set.
const FIREBASE_CONFIG_DEFAULTS = {
  apiKey: "AIzaSyBALgOUsJDbtOEguUy5c3p9nIP9SEfv-sc", // UPDATED from user
  authDomain: "sample-firebase-ai-app-5fdcf.firebaseapp.com",
  projectId: "sample-firebase-ai-app-5fdcf",
  storageBucket: "sample-firebase-ai-app-5fdcf.firebasestorage.app", // UPDATED from user
  messagingSenderId: "1073114565964",
  appId: "1:1073114565964:web:2becb166d6351114e993e9", // UPDATED from user
};

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || FIREBASE_CONFIG_DEFAULTS.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || FIREBASE_CONFIG_DEFAULTS.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || FIREBASE_CONFIG_DEFAULTS.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || FIREBASE_CONFIG_DEFAULTS.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || FIREBASE_CONFIG_DEFAULTS.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || FIREBASE_CONFIG_DEFAULTS.appId,
};

// Log the API key source and value for debugging
console.log("Firebase App Initialization: Attempting to use API Key.");
if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.log("%cFirebase API Key Source: process.env.NEXT_PUBLIC_FIREBASE_API_KEY", "color: blue; font-weight: bold;");
  console.log("Firebase API Key Value (from env):", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
} else {
  console.log("%cFirebase API Key Source: Hardcoded defaults (from your Firebase project config)", "color: orange; font-weight: bold;");
  console.log("Firebase API Key Value (from defaults):", FIREBASE_CONFIG_DEFAULTS.apiKey);
}
console.log("Full firebaseConfig to be used for initialization:", firebaseConfig);


// Initialize Firebase
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("%cFirebase app initialized successfully.", "color: green;");
  } catch (error) {
    console.error("%cError initializing Firebase app:", "color: red; font-weight: bold;", error);
    // Re-throw the error if you want to ensure it stops execution or is caught elsewhere
    // throw error; 
  }
} else {
  app = getApp();
  console.log("%cFirebase app already initialized.", "color: green;");
}

// Check for critical Firebase config values post-initialization attempt
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    console.error(
      "%cCRITICAL: Firebase configuration is missing essential values (apiKey, authDomain, projectId). " +
      "Firebase features will not work correctly. Please ensure your .env.local file is correct OR your Firebase project has valid default configuration. " +
      "Current API Key determined for use: ", "color: red; font-weight: bold;", firebaseConfig.apiKey
    );
  } else if (firebaseConfig.apiKey === "AIzaSyBALgOUsJDbtOEguUy5c3p9nIP9SEfv-sc" && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    // This specific check warns if the default key is used AND no env var is overriding it.
    // We adjust this slightly - if it's THIS specific default key and no env var, it means we're using the one from the console.
    // The main concern is if the API key is blank or a generic placeholder.
    console.info(
        "%cFirebase is using the API key from the hardcoded defaults in firebase.ts. " +
        "Ensure this key is correct and active for your 'sample-firebase-ai-app-5fdcf' project. " +
        "Check for API restrictions on this key in your Firebase Console (Project Settings > General > API Keys). ", "color: dodgerblue;"
    );
}


const auth = getAuth(app);
// const db = getFirestore(app); // Uncomment if you need Firestore
// const storage = getStorage(app); // Uncomment if you need Storage

export { app, auth /*, db, storage */ };
