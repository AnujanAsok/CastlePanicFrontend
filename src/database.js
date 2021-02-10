import firebase from "firebase/app";
import "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9TJMd9dTh-lyy9-crhM6_mTgt73N42kI",
  authDomain: "castlepanic-9082b.firebaseapp.com",
  databaseURL: "https://castlepanic-9082b-default-rtdb.firebaseio.com",
  projectId: "castlepanic-9082b",
  storageBucket: "castlepanic-9082b.appspot.com",
  messagingSenderId: "29298888899",
  appId: "1:29298888899:web:86786636450aaf2998d276",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database(); // move the firebase declaration to its own page later

export default database;
