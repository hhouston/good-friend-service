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
    notes: String
    date: String
    annual: Boolean
    status: EventStatus
  }

  input UpdateEventFields {
    recipientId: ID
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
    recipientId: ID
    createFriends(friends: String): [Friend]
    type: EventType!
    notes: String
    date: String
    annual: Boolean
    status: EventStatus
    deleted: Boolean
  }
`
// addFriends(friends: [FriendsInput!]!): [Friend!]!

export const resolver = ({ FriendMutation, friendService }) => ({
  createFriends: (parent, { friends }, context, info) => {
    console.log(parent);
    console.log('friendsssssssss', friends);
    console.log(context);
    console.log(info);
    return friendService.addFriends({ friends })
    // return FriendMutation.addFriends({ friends: { ...friends } })
  }
})

export const query = ({ eventService }) => ({
  getEventsByUserId: (parent, args, { user }, info) => {
    return eventService.getByUserId({ userId: user.id })
  },

  getEventsByEmail: (parent, args, { user }, info) => {
    return eventService.getByEmail({ email: user.email })
  },

  getEventById: (parent, { eventId }, context, info) => {
    return eventService.getByEventId({ eventId })
  }
})

export const mutation = ({ eventService }) => ({
  addEvent: async (parent, { event }, { user }, info) => {
    console.log('add eventttt');
    console.log(parent)
    return eventService.addEvent({ event })
  },

  addEvents: async (parent, { events, friends }, { user }, info) => {
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
