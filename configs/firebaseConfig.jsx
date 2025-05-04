// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-course-generator-5f401.firebaseapp.com",
  projectId: "ai-course-generator-5f401",
  storageBucket: "ai-course-generator-5f401.firebasestorage.app",
  messagingSenderId: "255209291770",
  appId: "1:255209291770:web:bce9b0ffb6aeb28a03ae43",
  measurementId: "G-2QWMMGNQKG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage=getStorage(app)