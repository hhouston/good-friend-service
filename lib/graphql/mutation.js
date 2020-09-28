import gql from 'graphql-tag'

export const typeDefs = gql`
  type Mutation {
    login(credentials: LoginInput!): String
    purchase(input: PurchaseInput!): String

    createEvent(event: EventInput!): String
    updateEvent(event: UpdateEventInput!): String

    addTeam(team: TeamInput!): String
    updateTeam(team: UpdateTeamInput!): String

    addPhotos(photos: PhotosInput!): String
    removePhotos(ids: [String!]!): String
  }
`

export const resolvers = ({
  UserMutation,
  TeamMutation,
  PhotoMutation,
  EventMutation
}) => ({
  login: (...args) => UserMutation.login(...args),
  purchase: (...args) => UserMutation.purchase(...args),

  createEvent: (...args) => EventMutation.createEvent(...args),
  updateEvent: (...args) => EventMutation.updateEvent(...args),

  addTeam: (...args) => TeamMutation.addTeam(...args),
  updateTeam: (...args) => TeamMutation.updateTeam(...args),

  addPhotos: (...args) => PhotoMutation.addPhotos(...args),
  removePhotos: (...args) => PhotoMutation.removePhotos(...args)
})

export default {
  typeDefs,
  resolvers
}
