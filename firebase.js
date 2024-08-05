// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8O9zfnELfn5xoRM6yUs1p1Pl4tRMc7KA",
  authDomain: "inventory-management-b10d9.firebaseapp.com",
  projectId: "inventory-management-b10d9",
  storageBucket: "inventory-management-b10d9.appspot.com",
  messagingSenderId: "578542768953",
  appId: "1:578542768953:web:6fa4029be1529501bd8ee8",
  measurementId: "G-C03P0WSMGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};