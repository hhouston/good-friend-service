import gql from 'graphql-tag'

export const typeDefs = gql`
  enum GiftType {
    STANDARD
    PREMIUM
    DELUX
  }

  enum CurrencyType {
    DOLLAR
    EURO
    PESO
  }

  enum StatusType {
    PENDING
    APPROVE
    MAYBE
    REJECT
  }

  input GiftInput {
    eventId: ID!
    name: String!
    description: String
    type: GiftType
    price: String
    currency: CurrencyType
    url: String!
    image: String
  }

  input UpdateGiftFields {
    eventId: ID
    name: String
    type: GiftType
    price: String
    currency: CurrencyType
    url: String
    image: String
    approved: Boolean
  }

  input UpdateGiftInput {
    id: ID!
    fields: UpdateGiftFields!
  }

  type Gift {
    id: ID!
    userId: ID!
    eventId: ID!
    name: String!
    description: String
    type: GiftType
    price: String
    currency: CurrencyType
    url: String!
    image: String
    approved: StatusType
    deleted: Boolean
  }
`

export const query = ({ giftService }) => ({
  getGiftById: (parent, { giftId }, context, info) => {
    return giftService.getGiftById({ giftId })
  },

  getGiftsByEventId: (parent, { eventId }, context, info) => {
    return giftService.getGiftsByEventId({ eventId })
  },

  getGiftsByUserId: (parent, args , { user }, info) => {
    return giftService.getGiftsByUserId({ userId: user.id })
  }
})

export const mutation = ({ giftService }) => ({
  addGift: async (parent, { gift }, { user }, info) => {
    return giftService.addGift({ userId: user.id, ...gift })
  },

  updateGift: (parent, { gift }, context, info) => {
    return giftService.updateGift({ ...gift })
  }
})

export default {
  typeDefs,
  query,
  mutation
}
