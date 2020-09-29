import gql from 'graphql-tag'

export const typeDefs = gql`
  type Mutation {
    login(credentials: LoginInput!): String
    purchase(input: PurchaseInput!): String

    createEvent(event: EventInput!): String
    updateEvent(event: UpdateEventInput!): String

    addGift(gift: GiftInput!): String
    updateGift(gift: UpdateGiftInput!): String

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
  EventMutation,
  GiftMutation
}) => ({
  login: (...args) => UserMutation.login(...args),
  purchase: (...args) => UserMutation.purchase(...args),

  createEvent: (...args) => EventMutation.createEvent(...args),
  updateEvent: (...args) => EventMutation.updateEvent(...args),

  addGift: (...args) => GiftMutation.addGift(...args),
  updateGift: (...args) => GiftMutation.updateGift(...args),

  addTeam: (...args) => TeamMutation.addTeam(...args),
  updateTeam: (...args) => TeamMutation.updateTeam(...args),

  addPhotos: (...args) => PhotoMutation.addPhotos(...args),
  removePhotos: (...args) => PhotoMutation.removePhotos(...args)
})

export default {
  typeDefs,
  resolvers
}
