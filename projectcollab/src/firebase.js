import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


export const firebaseConfig = {
  apiKey: "AIzaSyBaWhURS2GgOX3SVLxHj7wG60FQOaXW8Ak",
  authDomain: "tracker-43751.firebaseapp.com",
  projectId: "tracker-43751",
  storageBucket: "tracker-43751.appspot.com",
  messagingSenderId: "1056547806633",
  appId: "1:1056547806633:web:989c8825f3e29c37f3b8b8",
  measurementId: "G-XJQWTXFYCB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
export const firestore = getFirestore(app);

export { auth, provider };


