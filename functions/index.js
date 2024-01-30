/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions")
const express = require("express")
const admin = require("firebase-admin");
const app = express()
const  serviceAccount = require("./permisions.json");
const { gql, ApolloServer} = require("apollo-server-express");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const typeDefs = gql`
  type Grupos {
    address: String
    id: String!,
    leaders: String
    localization: String
    name: String
    photo: String
    red: String
    status: String
    persons: [String]
  }
  
  type Query {
    grupos(id: String): [Grupos]
  }
`
async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({typeDefs, resolvers})
  await server.start()
  server.applyMiddleware({app, path: "/", cors: true})
}
const resolvers = {
  Query: {
    grupos: async (_parent, args, _context) => {
      const doc = await db.collection('grupos').where("id", "==", args.id).get()
   /*   doc.forEach(d => {
        console.log("sdf"+d.data())
      })*/

      return doc.docs.map(f => f.data());
    }
  }
}
startApolloServer(typeDefs, resolvers)
app.use(require('./routes/assistance.routes'));
exports.app = functions.https.onRequest(app);

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
