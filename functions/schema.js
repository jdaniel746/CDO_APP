const { gql } = require('apollo-server-express')
const {} = require('grap')

const schema = gql`
  type Persona {
    id: String
    firstname: String
    middleName: String
    lastName: String
    sureName: String
    address: String
    birthdate: String
    identity: String
    photo: String
    localCode: String
    localPhone: String
    celCode: String
    celPhone: String
    invitedBy: String
`