// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

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

//Initialize Auth and Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

//Export them so firebase-login.js can use them
export { auth, provider };