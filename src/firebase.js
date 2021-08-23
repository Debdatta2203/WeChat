import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCJbAKJUmR_hUxGTQc4N56A3COlW9Fvr_c",
    authDomain: "wechat-c6147.firebaseapp.com",
    projectId: "wechat-c6147",
    storageBucket: "wechat-c6147.appspot.com",
    messagingSenderId: "1025215722516",
    appId: "1:1025215722516:web:f4fff6da3b4d06ffc2a301",
    measurementId: "G-1HDWMEHEB9"
});

const db = firebaseApp.firestore();

const auth = firebase.auth();

const storage = firebaseApp.storage();

export { db, auth, storage };