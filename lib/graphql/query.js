import gql from 'graphql-tag'

export const typeDefs = gql`
  type Query {
    getTopFacebookFriends(options: FacebookOptions!): [FacebookFriend]

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
  TeamQuery,
  StripeQuery
}) => ({
  getTopFacebookFriends: (...args) => FacebookQuery.getTopFriends(...args),

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
