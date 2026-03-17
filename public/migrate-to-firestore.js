// migrate-to-firestore.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

// Use same config as firebase-init.js
const firebaseConfig = {
  apiKey: "AIzaSyAZfTnD1BgdW4Z1vCgynW7hDrJHvuBbZd4",
  authDomain: "vinylvault-792a5.firebaseapp.com",
  projectId: "vinylvault-792a5",
  storageBucket: "vinylvault-792a5.appspot.com",
  messagingSenderId: "599058865340",
  appId: "1:599058865340:web:624005b3a12e50735944b9",
  measurementId: "G-J3ESRE2HZR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load records.json
const records = JSON.parse(fs.readFileSync('./public/records.json', 'utf8'));

// Upload each record to Firestore
async function uploadAll() {
  for (const record of records) {
    const ref = doc(db, 'albums', record.id);
    await setDoc(ref, record);
    console.log(`Uploaded: ${record.title}`);
  }
}

uploadAll().catch(console.error);
