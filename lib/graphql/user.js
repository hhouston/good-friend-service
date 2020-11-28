import gql from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: ID!
    type: String
    email: String!
    password: String
    firstName: String!
    lastName: String
    subscription: SubscriptionType!
    imageUrl: String
  }

  enum SubscriptionType {
    INACTIVE
    STANDARD
    PREMIUM
    VIP
  }

  input UpdateUserFields {
    password: String
    firstName: String
    lastName: String
    subscription: SubscriptionType
    imageUrl: String
  }

  input UpdateUserInput {
    id: ID!
    fields: UpdateUserFields!
  }

  input PurchaseInput {
    email: String!
    amount: Int!
    token: String!
  }
`

export const mutation = ({ userService }) => ({
  updateUser: async (parent, { user }, context, info) => {
    return userService.updateUser(user)
  },

  resetPassword: async (parent, { email }, context, info) => {
    return userService.resetPassword({ email })
  },

  purchase: async (parent, { input }, context, info) => {
    return userService.purchase({ ...input })
  }
})

export const query = ({ userService }) => ({
  getUserByEmail: (parent, { email }, context, info) => {
    return userService.getUserByEmail({ email })
  }
})

export default {
  typeDefs,
  mutation,
  query
}
