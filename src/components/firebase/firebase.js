import firebase from "firebase/app";
import "firebase/database";
import { firebaseConfig } from "../search_bar/firebase-config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

export { database };
