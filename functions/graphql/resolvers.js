const admin = require("firebase-admin")
const { GraphQLScalarType, Kind} = require("graphql")
const functions = require("firebase-functions")
const { FieldValue, where, and, query } = require('firebase-admin/firestore');
const util = require('../Utils/datesFunctions')
const enums = require('../Utils/enums')
//const { onSchedule } = require("firebase-functions/v2/scheduler");
//const { logger } = require("firebase-functions");

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
    groups: async (_parent, args, _context) => {
      const doc = await db.collection('grupos').where('id', '==', args.id).get();
      return doc.docs.map((f) => f.data());
    },
    person: async (_parent, args, _context) => {
      const doc = await db.collection('persona').doc(args.id);
      return (await doc.get()).data();
    },
    peopleByGroupId: async (_parent, args, _context) => {
      const group = await db.collection('grupos').doc(args.id).get();
      //people.push({id: p, firstname: pr.data().firstname, lastname: pr.data().lastname, photo: pr.data().photo})
      const pr = await db.collection('persona').where("id", "in", group.data().persons).get()
      return pr.docs.map((p) => p.data());
    }
  },
  Mutation: {
    addPitch: async (parent, { pitch }) => {
      let result = '';
      await db.collection('pitch/').doc().set(pitch).then(() => {
        result = "SUCCESS"
      }).catch((e) => {
        result = "ERROR " + e
      });
      return result;
    },
    addPerson: async (parent, { person }) => {
      const pers = await db.collection('persona')
        .where("firstname", "==", person.firstname)
        .where("lastname", "==", person.lastname).get();
      if(pers.size > 0) {
        return "PERSONA YA EXISTE"
      } else {
        const ref = db.collection('persona/');
        person.id = ref.doc().id
        await ref.doc(person.id).set(person)
        await db.collection('status_person').add({
          id_status: 1,
          id_person: person.id,
          date: new Date(),
          week: util.getWeekNumber(new Date()),
          counter: 1
        })
        return person.id;
      }
    },
    addAssistance: async (parent, { assistance }) => {
      let result = '';
      assistance.date = new Date();
      await db.collection('assistance/').doc().set(assistance).then((value) => {
        result = "SUCCESS"
      }).catch((e) => {
        result = "ERROR " + e
      })

      assistance.people.map((p) => {
        if(assistance.event_type === enums.eventsTypesEnum.GROUP){
          db.collection('persona').doc(p).update({weeks_group: FieldValue.arrayUnion(assistance.week)})
        } else if (assistance.event_type === enums.eventsTypesEnum.SERVICE) {
          db.collection('persona').doc(p).update({weeks_church: FieldValue.arrayUnion(assistance.week)})
        }

        db.collection('status_person').where("id_person", "==", p).orderBy("date", 'desc').limit(1).get().then((result) => {
          result.docs.map((s) => {
            const data = s.data()
            let diff = assistance.week - data.week

            switch (data.id_status){
              case 1: diff > 0 ? db.collection('status_person').add({id_person: data.id_person, id_status: 2, week: assistance.week, counter: 1, date: new Date()}) : null
                break;
              case 2: diff === 1 ? data.counter === 1 ? db.collection('status_person').doc(s.id).update({week: assistance.week, counter: 2}) :
                db.collection('status_person').add({id_person: data.id_person, id_status: 3, week: assistance.week, counter: 1, date: new Date()}) :
                db.collection('status_person').doc(s.id).update({week: assistance.week, counter: 1})
                break;
              case 3: diff === 1 ? data.counter === 1 ? db.collection('status_person').doc(s.id).update({week: assistance.week, counter: 2}) :
                db.collection('status_person').add({id_person: data.id_person, id_status: 4, week: assistance.week, counter: 1, date: new Date()}):
                db.collection('status_person').doc(s.id).update({week: assistance.week, counter: 1})
                break;
              case 4:diff === 1 ? db.collection('status_person').doc(s.id).update({week: assistance.week, counter: data.counter + 1}) : null
                break;
            }
          })
        }).catch((e) => {
          console.log("ERROR " + JSON.stringify(e))
        })
      })

      db.collection('grupos').doc(assistance.group).get().then((rs) => {
        rs.data().persons.filter(p => !assistance.people.includes(p)).map((p) => {
          db.collection('status_person').where("id_person", "==", p).orderBy("date", "desc").limit(1).get().then((rs) => {
            rs.docs.map((data) => {
              const { week } = data.data();
              const currentWeek = util.getWeekNumber(new Date())
              if(currentWeek - week > 3) {
                db.collection('status_person').doc(data.id).create({id_person: p, id_status: 5, week: currentWeek, counter: 1, date: new Date()})
              }else {
                db.collection('status_person').doc(data.id).update({counter: 1})
              }
            })
          })
        })
      })

      return result
    }
  }
};

/*exports.addWelcome = functions.auth.user().onCreate(event => {
  console.log(JSON.stringify(event.data))
})

exports.createPerson = functions.firestore.document('persona').onCreate(event => {
  console.log("onCreate")
  console.log(JSON.stringify(event))
})*/

/*exports.scheduledFunction = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
  console.log('This will be run every 5 minutes!');
});
exports.findPeopleOnAlert = onSchedule("* * * * *", async (event) => {
  logger.log("User cleanup finished");
  console.log("cron " + JSON.stringify(event))
})*/
module.exports = resolvers