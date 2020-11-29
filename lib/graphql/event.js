import gql from 'graphql-tag'
import { map, pick } from 'ramda'

export const typeDefs = gql`
  enum EventType {
    ANNIVERSARY
    BIRTHDAY
    CHRISTMAS
    CHRISTMAS_BUNDLE
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
    recipientIds: [ID]
    type: EventType
    notes: String
    date: String
    annual: Boolean
    status: EventStatus
  }

  input UpdateEventFields {
    recipientIds: [ID]
    type: EventType
    notes: String
    date: String
    annual: Boolean
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
    recipientIds: [ID]
    createFriends(friends: [FriendInput]): [Friend]
    type: EventType!
    notes: String
    date: String
    annual: Boolean
    status: EventStatus
    deleted: Boolean
  }
`

export const resolver = ({ FriendMutation, friendService, eventService }) => ({
  createFriends: async ({ id: eventId }, { friends }, context, info) => {
    const friendsResp = await friendService.addFriends({ friends })
    const friendIds = map((friend) => friend.id, friendsResp)
    const fields = { recipientIds: friendIds }
    const updateEventResp = await eventService.updateEvent({ id: eventId, fields })
    return friendsResp
  }
})

export const query = ({ eventService }) => ({
  getEventsByUserId: (parent, { userId }, context, info) => {
    return eventService.getByUserId({ userId })
  },

  getEventById: (parent, { eventId }, context, info) => {
    return eventService.getByEventId({ eventId })
  }
})

export const mutation = ({ eventService }) => ({
  addEvent: async (parent, { event }, { user }, info) => {
    return eventService.addEvent({ event })
  },

  addEvents: async (parent, { events }, { user }, info) => {
    return eventService.addEvents({ events })
  },

  updateEvent: (parent, { event }, context, info) => {
    return eventService.updateEvent({ ...event })
  }
})

export default {
  typeDefs,
  resolver,
  query,
  mutation
}
