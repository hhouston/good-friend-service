import gql from 'graphql-tag'

export const typeDefs = gql`
  input SignUpInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String
    birthday: String
    subscription: SubscriptionType!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type User {
    id: ID!
    email: String!
    password: String
    firstName: String!
    lastName: String
    subscription: SubscriptionType!
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
  }

  input UpdateUserInput {
    id: ID!
    fields: UpdateUserFields!
  }

  input PurchaseInput {
    email: String!
    amount: Int!
    photoIds: [String!]!
    token: String!
  }
`

export const mutation = ({ userService }) => ({
  signUp: async (parent, { credentials }, context, info) => {
    return userService.signUp(credentials)
  },

  login: async (parent, { credentials }, context, info) => {
    console.log('context: ', context)
    
    return userService.login(credentials)
  },

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

export default {
  typeDefs,
  mutation
}
