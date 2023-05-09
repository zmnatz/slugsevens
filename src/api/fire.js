import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

var config = {
  /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: "AIzaSyBYODCCyoF-jJFYKhb8zdb2qYcwbp6w0Ns",
  authDomain: "rockygorgetournaments.firebaseapp.com",
  databaseURL: "https://rockygorgetournaments.firebaseio.com",
  projectId: "rockygorgetournaments",
  storageBucket: "rockygorgetournaments.appspot.com",
  messagingSenderId: "802837198898",
};

const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const provider = new GoogleAuthProvider();

export function signIn() {
  signInWithPopup(auth, provider);
}
