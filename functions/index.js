/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//const {onSchedule} = require("firebase-functions/v2/scheduler");
const functions = require("firebase-functions")
const express = require("express")
const admin = require("firebase-admin");
const app = express()
//const { createPerson } = require('./graphql/resolvers')

const  serviceAccount = require("./permisions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
app.use(require("./graphql/server"))
//app.use(createPerson)
/*exports.findPeopleOnAlert = onSchedule("* * * * *", async (event) => {
  logger.log("User cleanup finished");
  console.log("cron " + JSON.stringify(event))
})*/
exports.helloEveryMinute = functions.pubsub.schedule("*/1 * * * *").onRun((context) => {
  console.log("cron " + JSON.stringify(context))
  return null;
})
exports.app = functions.https.onRequest(app);
