import gql from 'graphql-tag'

export const typeDefs = gql`
  input SignUpInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String
    birthday: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateUserFields {
    password: String
    firstName: String
    lastName: String
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
