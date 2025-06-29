// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import getAuth for authentication services
// import { getFirestore } from 'firebase/firestore'; // Example for other services

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBePrYxmjyTFpDJWhYkZPdEkU6c2DqISjI",
    authDomain: "spendwise-3df34.firebaseapp.com",
    projectId: "spendwise-3df34",
    storageBucket: "spendwise-3df34.firebasestorage.app",
    messagingSenderId: "386056177199",
    appId: "1:386056177199:web:1d0e1f7ae1c9a07e53e8da",
    measurementId: "G-HFMK5DYFB7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
// const db = getFirestore(app); // Example for Firestore

export { app, auth };