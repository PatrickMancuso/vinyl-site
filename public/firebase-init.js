// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZfTnD1BgdW4Z1vCgynW7hDrJHvuBbZd4",
  authDomain: "vinylvault-792a5.firebaseapp.com",
  projectId: "vinylvault-792a5",
  storageBucket: "vinylvault-792a5.appspot.com", // corrected typo
  messagingSenderId: "599058865340",
  appId: "1:599058865340:web:624005b3a12e50735944b9",
  measurementId: "G-J3ESRE2HZR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // <-- Firestore

export { auth, provider, db };