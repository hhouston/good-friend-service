import gql from 'graphql-tag'

export const typeDefs = gql`
  type Query {
    getTopFacebookFriends(options: FacebookOptions!): [FacebookFriend]

    getEventById(eventId: ID!): Event!
    getEventsByUserId(userId: ID!): [Event!]!

    getGiftById(giftId: ID!): Gift!
    getGiftsByEventId(eventId: ID!): [Gift!]!
    getGiftsByUserId(userId: ID!): [Gift!]!

    getPhotosById(ids: [ID!]!): [Photo!]
    getPhotosByTeam(teamId: ID!): [Photo!]!
    getPhotosByPlayer(playerId: ID!): [Photo!]!
    getPhotosDownloadUrl(ids: [ID!]!): [String!]

    getTeams: [Team]
    getTeam(teamId: ID!): Team
  }
`

export const resolvers = ({
  FacebookQuery,
  PhotoQuery,
  EventQuery,
  GiftQuery,
  TeamQuery,
  StripeQuery
}) => ({
  getTopFacebookFriends: (...args) => FacebookQuery.getTopFriends(...args),

  getEventById: (...args) => EventQuery.getEventById(...args),
  getEventsByUserId: (...args) => EventQuery.getEventsByUserId(...args),

  getGiftById: (...args) => GiftQuery.getGiftById(...args),
  getGiftsByEventId: (...args) => GiftQuery.getGiftsByEventId(...args),
  getGiftsByUserId: (...args) => GiftQuery.getGiftsByUserId(...args),

  getPhotosById: (...args) => PhotoQuery.getById(...args),
  getPhotosByTeam: (...args) => PhotoQuery.getByTeam(...args),
  getPhotosByPlayer: (...args) => PhotoQuery.getByPlayer(...args),
  getPhotosDownloadUrl: (...args) => PhotoQuery.getDownloadUrl(...args),

  getTeams: (...args) => TeamQuery.getTeams(...args),
  getTeam: (...args) => TeamQuery.getTeam(...args),

})

export default {
  typeDefs,
  resolvers
}
