/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const functions = require("firebase-functions")
const express = require("express")
const admin = require("firebase-admin");
const app = express()

const  serviceAccount = require("./permisions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
app.use(require("./graphql/server"))
//const api = https.onRequest(gqlServer());
//app.use(require('./routes/assistance.routes'));
//export { api }
exports.app = functions.https.onRequest(app);

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
