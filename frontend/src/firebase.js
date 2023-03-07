// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = initializeApp({
  apiKey: "AIzaSyCNrtZTQAWUlmyae_Ye3R6UiIaFBjORy2c",
  authDomain: "tacoclass-9524b.firebaseapp.com",
  projectId: "tacoclass-9524b",
  storageBucket: "tacoclass-9524b.appspot.com",
  messagingSenderId: "782774141621",
  appId: "1:782774141621:web:4bb59a453c099c99c434fc"
});

// Initialize Firebase
export const provider = new GoogleAuthProvider(app);
// eslint-disable-next-line no-unused-vars
export const auth = getAuth(app);
// export const auth = getAuth(app);
// const analytics = getAnalytics(app);