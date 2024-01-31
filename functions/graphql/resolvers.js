const admin = require("firebase-admin")

const db = admin.firestore();

const resolvers = {
  Query: {
    grupos: async (_parent, args, _context) => {
      const doc = await db.collection('grupos')
        .where("id", "==", args.id).get()
      /*   doc.forEach(d => {
           console.log("sdf"+d.data())
         })*/

      return doc.docs.map(f => f.data());
    },
    persona: async (_parent, args, _context) => {
      const doc = await db.collection('persona').doc(args.id)
      return (await doc.get()).data()
    }
  }
}

module.exports = resolvers