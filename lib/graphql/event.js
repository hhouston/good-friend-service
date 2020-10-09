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

  enum EventStatus {
    NEW
    PENDING
    ACTIVE
    COMPLETED
  }

  input EventInput {
    userId: ID
    recipientId: ID
    type: EventType
    date: String
    annual: Boolean
    gift: [String!]
    status: EventStatus
  }

  input UpdateEventFields {
    recipientId: ID
    type: EventType
    date: String
    annual: Boolean
    gift: [String!]
    status: EventStatus
    deleted: Boolean
  }

  input UpdateEventInput {
    id: ID!
    fields: UpdateEventFields!
  }

  type Event {
    id: ID!
    userId: ID!
    recipientId: ID
    type: EventType!
    date: String
    annual: Boolean
    gift: [String!]
    status: EventStatus
    deleted: Boolean
  }
`

export const query = ({ eventService }) => ({
  getEventsByUserId: (parent, { userId }, context, info) => {
    return eventService.getByUserId({ userId })
  },

  getEventById: (parent, { eventId }, context, info) => {
    return eventService.getByEventId({ eventId })
  }
})

export const mutation = ({ eventService }) => ({
  createEvent: async (parent, { event }, context, info) => {
    return eventService.createEvent({ event })
  },

  updateEvent: (parent, { event }, context, info) => {
    return eventService.updateEvent({ ...event })
  }
})

export default {
  typeDefs,
  query,
  mutation
}
