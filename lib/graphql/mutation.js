import gql from 'graphql-tag'

export const typeDefs = gql`
  type Mutation {
    signUp(credentials: SignUpInput!): String
    login(credentials: LoginInput!): String
    purchase(input: PurchaseInput!): String

    addFriend(friend: FriendInput!): String

    createEvent(event: EventInput!): String
    updateEvent(event: UpdateEventInput!): String

    addGift(gift: GiftInput!): String
    updateGift(gift: UpdateGiftInput!): String

    addPhotos(photos: PhotosInput!): String
    removePhotos(ids: [String!]!): String
  }
`

export const resolvers = ({
  UserMutation,
  PhotoMutation,
  FriendMutation,
  EventMutation,
  GiftMutation
}) => ({
  signUp: (...args) => UserMutation.signUp(...args),
  login: (...args) => UserMutation.login(...args),
  purchase: (...args) => UserMutation.purchase(...args),

  addFriend: (...args) => FriendMutation.addFriend(...args),

  createEvent: (...args) => EventMutation.createEvent(...args),
  updateEvent: (...args) => EventMutation.updateEvent(...args),

  addGift: (...args) => GiftMutation.addGift(...args),
  updateGift: (...args) => GiftMutation.updateGift(...args),

  addPhotos: (...args) => PhotoMutation.addPhotos(...args),
  removePhotos: (...args) => PhotoMutation.removePhotos(...args)
})

export default {
  typeDefs,
  resolvers
}
