import gql from 'graphql-tag'

export const typeDefs = gql`
  type Mutation {
    updateUser(user: UpdateUserInput!): String
    resetPassword(user: ResetPasswordInput!): String
    purchase(input: PurchaseInput!): String

    addFriend(friend: FriendInput!): String
    addFriends(friends: FriendInput!): String
    updateFriend(friend: UpdateFriendInput!): String

    addEvent(event: [EventInput]!): Event
    addEvents(events: [EventInput!]!): [Event]
    updateEvent(event: UpdateEventInput!): String

    addGift(gift: GiftInput!): String
    updateGift(gift: UpdateGiftInput!): String

    addTransaction(transaction: String): String

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
  updateUser: (...args) => UserMutation.updateUser(...args),
  resetPassword: (...args) => UserMutation.resetPassword(...args),
  purchase: (...args) => UserMutation.purchase(...args),

  addFriend: (...args) => FriendMutation.addFriend(...args),
  addFriends: (...args) => {
    console.log('FRIENDS RESOLVER: ', ...args);
    return FriendMutation.addFriends(...args)
  },
  updateFriend: (...args) => FriendMutation.updateFriend(...args),

  addEvent: (...args) => EventMutation.addEvent(...args),
  addEvents: (...args) => EventMutation.addEvents(...args),
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
