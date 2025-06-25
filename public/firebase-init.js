// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZfTnD1BgdW4Z1vCgynW7hDrJHvuBbZd4",
  authDomain: "vinylvault-792a5.firebaseapp.com",
  projectId: "vinylvault-792a5",
  storageBucket: "vinylvault-792a5.firebasestorage.app",
  messagingSenderId: "599058865340",
  appId: "1:599058865340:web:624005b3a12e50735944b9",
  measurementId: "G-J3ESRE2HZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);