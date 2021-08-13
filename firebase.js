import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAC-0HPlNXobUXa3DH8zTlfpJmkeUQRozo",
  authDomain: "next-firebase-9f6ea.firebaseapp.com",
  projectId: "next-firebase-9f6ea",
  storageBucket: "next-firebase-9f6ea.appspot.com",
  messagingSenderId: "743318004811",
  appId: "1:743318004811:web:2813c295033509275199ce",
  measurementId: "G-DSB6FS0ZDR",
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();

export { db };
