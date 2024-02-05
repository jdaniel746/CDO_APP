const { gql } = require("apollo-server-express");

const schema = gql`

  scalar Date

  type Grupo {
    address: String
    id: String!
    leaders: String
    localization: String
    name: String
    photo: String
    red: String
    status: String
    persons: [String]
    dayofweek: String
  }
  
  type Persona {
    id: String!
    firstname: String
    middlename: String
    lastname: String
    surname: String
    address: String
    birthdate: String
    identify: String
    photo: String
    localcode: String
    localphone: String
    celcode: String
    celphone: String
    invitedby: String
    newingroup: Boolean
  }
  
  input InPersona {
    firstname: String!
    middlename: String
    lastname: String
    surname: String
    address: String
    birthdate: String
    identify: String
    photo: String
    localcode: String
    localphone: String
    celcode: String
    celphone: String
    invitedby: String
    newingroup: Boolean
    
  }
  
  type Status {
    id: String!
    name: String!
    description: String
    conditionweek: Int
  }
  
  type StatusPersona {
    id_persona: String!
    id_status: String!
    date: Date
  }
  
  type Predica {
    id: String
    title: String!
    subtitle: String
    intro: String
    content1: String
    content2: String
    content3: String
    finality: String
    offer: String
    intercession: String
    week: Int
    dates: Date
  }
  
  input InPredica {
    title: String!
    subtitle: String
    intro: String
    content1: String
    content2: String
    content3: String
    finality: String
    offer: String
    intercession: String
    week: Int
    dates: Date
  }
  
  type Asistencia {
    id: String
    created: Date
    offerbs: Float
    offerdol: Float
    photo: String
    comment: String
    week: Int
    group: String
    eventtype: String!
  }
  
   input InAsistencia {
    id: String
    offerbs: Float
    offerdol: Float
    photo: String
    comment: String
    week: Int
    group: String
    eventtype: String!
    people: [String!]
    
  }
  
  type Mutation {
    addPredica(pitch: InPredica!): String
    addPersona(persona: InPersona!): String
  }
  
  type Query {
    grupos(id: String): [Grupo]
    persona(id: String): Persona
  }
    
`
module.exports = schema;