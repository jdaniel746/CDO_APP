const { gql } = require("apollo-server-express");

const schema = gql`

  scalar Date

  type Group {
    address: String
    id: String!
    leaders: String
    localization: String
    name: String
    photo: String
    red: String
    status: String
    people: [String]
    day_of_week: String
  }
  
  type Person {
    id: String!
    firstname: String
    middlename: String
    lastname: String
    surname: String
    address: String
    birthdate: String
    identify: String
    photo: String
    local_code: String
    local_phone: String
    cel_code: String
    cel_phone: String
    invited_by: String
    new_in_group: Boolean
    weeks_group: [Int]
    weeks_church: [Int]
    registered_by: String
  }
  
  input InPerson {
    firstname: String!
    middlename: String
    lastname: String!
    surname: String
    address: String
    birthdate: String
    identify: String
    photo: String
    local_code: String
    local_phone: String
    cel_code: String
    cel_phone: String
    invited_by: String
    new_in_group: Boolean!
    
  }
  
  type Status {
    id: String!
    name: String!
    description: String
    condition_week: Int
  }
  
  type StatusPerson {
    id_person: String!
    id_status: String!
    date: Date!
    week: Int!
    counter: Int!
  }
  
  type Pitch {
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
  
  input InPitch {
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
  
  type Assistance {
    id: String
    created_date: Date
    offer_bs: Float
    offer_dol: Float
    photo: String
    comment: String
    week: Int
    group: String
    event_type: String!
    people: [String!]!
    new: [String]
    affirmed: [String]
    wined: [String]
    consolidated: [String]
    adl: [String]
    alert: [String]
    leaders: [String]
    cod7: [String]
    others: [String]
  }
  
   input InAssistance {
    id: String
    offer_bs: Float
    offer_dol: Float
    photo: String
    comment: String
    week: Int
    group: String
    event_type: String!
    date: Date
    people: [String!]
  }
  
  type Mutation {
    addPitch(pitch: InPitch!): String
    addPerson(person: InPerson!): String
    addAssistance(assistance: InAssistance!): String
  }
  
  type Query {
    groups(id: String): [Group]
    person(id: String): Person
    peopleByGroupId(id: String): [Person]
  }
    
`
module.exports = schema;