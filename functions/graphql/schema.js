const { gql } = require("apollo-server-express");

const schema = gql`
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
  }
  
  type Query {
    grupos(id: String): [Grupo]
    persona(id: String): Persona
  }
    
`
module.exports = schema;