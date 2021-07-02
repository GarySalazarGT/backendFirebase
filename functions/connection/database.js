const admin = require('firebase-admin');

var serviceAccount = require("../../pro-insight-76261-firebase-adminsdk-3p09h-e4e75907ff.json");

    admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     databaseURL: "https://pro-insight-76261.firebaseio.com"
     });

const db = admin.firestore();

module.exports = { admin, db };