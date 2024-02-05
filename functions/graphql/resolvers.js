const admin = require("firebase-admin")
const { GraphQLScalarType, Kind} = require("graphql")
const functions = require("firebase-functions")

const db = admin.firestore();

const resolverMap = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value) // value from the client
    },
    serialize(value) {
      return value.getTime() // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(+ast.value) // ast value is always in string format
      }
      return null
    }
  })
}

const resolvers = {
  Date: resolverMap,
  Query: {
    grupos: async (_parent, args, _context) => {
      const doc = await db.collection('grupos').where('id', '==', args.id).get();
      /*   doc.forEach(d => {
           console.log("sdf"+d.data())
         })*/

      return doc.docs.map((f) => f.data());
    },
    persona: async (_parent, args, _context) => {
      const doc = await db.collection('persona').doc(args.id);
      return (await doc.get()).data();
    }
  },
  Mutation: {
    addPredica: async (parent, { pitch }) => {
      let result = '';
      await db.collection('predica/').doc().set(pitch).then(() => {
        result = "SUCCESS"
      }).catch((e) => {
        result = "ERROR " + e
      });
      return result;
    },
    addPersona: async (parent, { persona }) => {
      let result = '';
      await db.collection('persona/').doc().set(persona).then(() => {

        result = "SUCCESS"
      }).catch((e) => {
        result = "ERROR " + e
      });

      if(persona.newingroup) {

      }
      return result;
    }
  }
};

exports.addWelcome = functions.auth.user().onCreate(event => {
  console.log(JSON.stringify(event.data))
})

exports.createPerson = functions.firestore.document('persona').onUpdate(event => {
  console.log(JSON.stringify(event))
})
module.exports = resolvers