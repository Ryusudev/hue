// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJ8bMlm_mhT4pnZJYrluUCi1U7ULo6vRk",
  authDomain: "huee-7f5c9.firebaseapp.com",
  projectId: "huee-7f5c9",
  storageBucket: "huee-7f5c9.firebasestorage.app",
  messagingSenderId: "745354960444",
  appId: "1:745354960444:web:b9998db50460791619ad39",
  measurementId: "G-NT9EYM5VHC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export for use in other files
export { db, auth };