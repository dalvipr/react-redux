import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";


var config = {
    apiKey: "AIzaSyB0Y0zkWrMimXJE2IoBRl7DEGV8C8P8f4U",
    authDomain: "react-slack-clone-a7393.firebaseapp.com",
    databaseURL: "https://react-slack-clone-a7393.firebaseio.com",
    projectId: "react-slack-clone-a7393",
    storageBucket: "react-slack-clone-a7393.appspot.com",
    messagingSenderId: "675531106018"
};
firebase.initializeApp(config);

export default firebase;