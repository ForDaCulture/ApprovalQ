import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { OpenAI } from 'openai';

// Debug environment setup
const isProduction = process.env.NODE_ENV === 'production';
const envDebug = {
    NODE_ENV: process.env.NODE_ENV,
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY_DEV,
};
console.log('Environment:', envDebug);

const firebaseConfig = {
    apiKey: isProduction ? process.env.REACT_APP_FIREBASE_API_KEY_PROD : process.env.REACT_APP_FIREBASE_API_KEY_DEV,
    authDomain: isProduction ? process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_PROD : process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_DEV,
    projectId: isProduction ? process.env.REACT_APP_FIREBASE_PROJECT_ID_PROD : process.env.REACT_APP_FIREBASE_PROJECT_ID_DEV,
    storageBucket: isProduction ? process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_PROD : process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_DEV,
    messagingSenderId: isProduction ? process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_PROD : process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_DEV,
    appId: isProduction ? process.env.REACT_APP_FIREBASE_APP_ID_PROD : process.env.REACT_APP_FIREBASE_APP_ID_DEV,
};

// Safety check and error handling
if (!firebaseConfig.apiKey) {
    console.error('Firebase API Key is missing. Check your .env.development file and restart the server.');
    throw new Error('Missing Firebase API Key');
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});