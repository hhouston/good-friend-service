import gql from 'graphql-tag'

export const typeDefs = gql`
  type Query {
    getFriendById(friendId: ID!): Friend!
    getFriendsByUserId(userId: ID!): [Friend!]!

    getEventById(eventId: ID!): Event!
    getEventsByUserId(userId: ID!): [Event!]!

    getGiftById(giftId: ID!): Gift!
    getGiftsByEventId(eventId: ID!): [Gift!]!
    getGiftsByUserId(userId: ID!): [Gift!]!

    getPhotosById(ids: [ID!]!): [Photo!]
    getPhotosByTeam(teamId: ID!): [Photo!]!
    getPhotosByPlayer(playerId: ID!): [Photo!]!
    getPhotosDownloadUrl(ids: [ID!]!): [String!]
  }
`

export const resolvers = ({
  PhotoQuery,
  FriendQuery,
  EventQuery,
  GiftQuery,
  StripeQuery
}) => ({
  getFriendById: (...args) => FriendQuery.getFriendById(...args),
  getFriendsByUserId: (...args) => FriendQuery.getFriendsByUserId(...args),

  getEventById: (...args) => EventQuery.getEventsById(...args),
  getEventsByUserId: (...args) => EventQuery.getEventsByUserId(...args),

  getGiftById: (...args) => GiftQuery.getGiftById(...args),
  getGiftsByEventId: (...args) => GiftQuery.getGiftsByEventId(...args),
  getGiftsByUserId: (...args) => GiftQuery.getGiftsByUserId(...args),

  getPhotosById: (...args) => PhotoQuery.getById(...args),
  getPhotosByTeam: (...args) => PhotoQuery.getByTeam(...args),
  getPhotosByPlayer: (...args) => PhotoQuery.getByPlayer(...args),
  getPhotosDownloadUrl: (...args) => PhotoQuery.getDownloadUrl(...args)
})

export default {
  typeDefs,
  resolvers
}
