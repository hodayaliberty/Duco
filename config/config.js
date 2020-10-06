import firebase from 'firebase';
import firestore from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAQFklPOHG3Dn-hRWcjvIrbyvWbsqytbuw",
    authDomain: "duko-facd8.firebaseapp.com",
    databaseURL: "https://duko-facd8.firebaseio.com",
    projectId: "duko-facd8",
    storageBucket: "duko-facd8.appspot.com",
    messagingSenderId: "742543163366",
    appId: "1:742543163366:web:a03c56fa7ae733b14ee027",
    measurementId: "G-26KH70LWNP"
  };

firebase.initializeApp(firebaseConfig);
export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
export default f;
export const db = f.firestore();

//db.settings({timestampsInSnapshots:false});

