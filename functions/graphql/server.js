const {ApolloServer} = require("apollo-server-express")
const express = require("express")
const resolvers = require("./resolvers")
const schema = require("./schema")
function gqlServer() {
  const app = express();

  async function startApolloServer(schema, resolvers) {
    const server = new ApolloServer({typeDefs: schema, resolvers})
    await server.start()
    server.applyMiddleware({app, path: "/", cors: true})
  }

  startApolloServer(schema, resolvers)

  return app;
}

module.exports = gqlServer();