import gql from 'graphql-tag'

export const typeDefs = gql`

  enum EventType {
    ANNIVERSARY
    BIRTHDAY
    CHRISTMAS
    GRADUATION
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
    recipientId: ID!
    type: EventType!
    name: String!
    date: String!
  }
`

export const mutation = ({ eventService }) => ({
  createEvent: async (parent, { event }, context, info) => {
    return eventService.create({ event })
  }
})

export default {
  typeDefs,
  mutation
}
