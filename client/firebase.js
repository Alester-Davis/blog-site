// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQshwd5C0kIbI9_qXjJsKSthvV-ClJIpA",
  authDomain: "mern-blog-e4a67.firebaseapp.com",
  projectId: "mern-blog-e4a67",
  storageBucket: "mern-blog-e4a67.appspot.com",
  messagingSenderId: "475001373918",
  appId: "1:475001373918:web:ee5099d18f9937809fee4f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);