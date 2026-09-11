import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwMn9GmmsRd0Ct4VxFFhVNE_WZOU-VXU8",
  authDomain: "trynum1-5f35c.firebaseapp.com",
  projectId: "trynum1-5f35c",
  storageBucket: "trynum1-5f35c.firebasestorage.app",
  messagingSenderId: "1004835519242",
  appId: "1:1004835519242:web:5c094bd0ea05a4d09418f3",
  measurementId: "G-X1FT4ZEKZ3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);