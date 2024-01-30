const { Router } = require('express')
const functions = require('firebase-functions')
const express = require('express')
const admin = require("firebase-admin");
const { ApolloServer, gql } = require("apollo-server-express")
const router = Router();

const db = admin.firestore();

const typeDefs = gql`
  type Grupos {
    address: String
    id: String,
    leaders: String
    localization: String
    name: String
    photo: String
    red: String
    status: String
    persons: [String]
  }
  
  type Query {
    grupos: [Grupos]
  }
`
async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({typeDefs, resolvers})
  const app = express()
  await server.start()
  server.applyMiddleware({app, path: "/a", cors: true})
}
const resolvers = {
  Query: {
    grupos: () => {
      db.doc('grupos').onSnapshot(snapshot => snapshot.data())
    }
  }
}


router.get('/users/:userId', async (req, res) => {
  try {
    const doc = await db.collection('users')
      .where("id","==", req.params.userId).get()//.doc(req.params.userId)
   const arr = []
    doc.forEach(d => {
      arr.push(d.data())
    })
    return res.status(200).json(arr)
  } catch (e) {
    return res.status(500).send(e);
  }

});
startApolloServer(typeDefs, resolvers)
//exports.graphql = functions.https.onRequest(app)
module.exports = router