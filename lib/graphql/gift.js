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

  input GiftInput {
    userId: ID
    eventId: ID
    type: GiftType
    price: String
    currency: CurrencyType
    url: String
    image: String
  }

  input UpdateGiftFields {
    eventId: ID
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
    userId: ID
    eventId: ID
    type: GiftType
    price: String
    currency: CurrencyType
    url: String
    image: String
    approved: Boolean
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

  getGiftsByUserId: (parent, { userId }, context, info) => {
    return giftService.getGiftsByUserId({ userId })
  }
})

export const mutation = ({ giftService }) => ({
  addGift: async (parent, { gift }, context, info) => {
    return giftService.addGift({ gift })
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