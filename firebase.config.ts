// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjzrJv4pTf_8ZIb-BxIdFXFjhaF5e7wuM",
  authDomain: "cheesy-5e033.firebaseapp.com",
  projectId: "cheesy-5e033",
  storageBucket: "cheesy-5e033.appspot.com",
  messagingSenderId: "235499087448",
  appId: "1:235499087448:web:fdb4685454785e1bb10c2d",
  measurementId: "G-JEQ1PN50PF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
