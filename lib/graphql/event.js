import gql from 'graphql-tag'

export const typeDefs = gql`

  enum EventType {
    ANNIVERSARY
    BIRTHDAY
    CHRISTMAS
    GRADUATION
    BABY_SHOWER
    MOTHERS_DAY
    FATHERS_DAY
    OTHER
  }

  input EventInput {
    userId: ID
    recipientId: ID
    type: EventType!
    name: String!
    date: String!
  }

  type Event {
    id: ID!
    userId: ID!
    recipientId: ID
    type: EventType!
    date: String
    anual: Boolean
    gift: [String!]
  }
`

export const mutation = ({ eventService }) => ({
  createEvent: async (parent, { event }, context, info) => {
    return eventService.createEvent({ event })
  }
})

export default {
  typeDefs,
  mutation
}
