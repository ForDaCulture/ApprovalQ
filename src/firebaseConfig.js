// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDiKeEHttNKh6Vibhf_N4hg_Cv7EZngYGA",
  authDomain: "approvalq-1126b.firebaseapp.com",
  projectId: "approvalq-1126b",
  storageBucket: "approvalq-1126b.firebasestorage.app",
  messagingSenderId: "152433873633",
  appId: "1:152433873633:web:1b431daa3ab2c423c4dda0",
  measurementId: "G-H2WRB9QZ1B"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export additional services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the initialized app for other uses
export { app };