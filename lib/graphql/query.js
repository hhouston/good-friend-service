import gql from 'graphql-tag'

export const typeDefs = gql`
  type Query {
    getFriendById(friendId: ID!): Friend!
    getFriendsByUserId(userId: ID!): [Friend!]!

    getAllUsers: [User!]
    getUsersByCurtorId(curatorId: ID!): [User!]
    getUserByEmail(email: String!): User!

    getEventsByUserId(userId: ID!): [Event!]!

    getGiftById(giftId: ID!): Gift!
    getGiftsByEventId(eventId: ID!): [Gift!]!
    getGiftsByUserId(userId: ID!): [Gift!]!

    getAllTransactions: [Transaction]

    getPhotosById(ids: [ID!]!): [Photo!]
    getPhotosByTeam(teamId: ID!): [Photo!]!
    getPhotosByPlayer(playerId: ID!): [Photo!]!
    getPhotosDownloadUrl(ids: [ID!]!): [String!]
  }
`

export const resolvers = ({
  PhotoQuery,
  FriendQuery,
  UserQuery,
  EventQuery,
  GiftQuery,
  TransactionQuery
}) => ({
  getFriendById: (...args) => FriendQuery.getFriendById(...args),
  getFriendsByUserId: (...args) => FriendQuery.getFriendsByUserId(...args),

  getAllUsers: (...args) => UserQuery.getAllUsers(...args),
  // getUsersByCuratorId: (...args) => UserQuery.getUsersByCuratorId(...args),
  getUserByEmail: (...args) => UserQuery.getUserByEmail(...args),

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
