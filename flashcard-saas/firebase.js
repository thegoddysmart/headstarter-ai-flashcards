// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8ncx791zec-mdkZJjVZThso6OhmpSGkA",
  authDomain: "ai-flashcard-saas-882b9.firebaseapp.com",
  projectId: "ai-flashcard-saas-882b9",
  storageBucket: "ai-flashcard-saas-882b9.appspot.com",
  messagingSenderId: "991679112061",
  appId: "1:991679112061:web:af735153eb002e015a6214",
  measurementId: "G-HFTQFHDV7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
