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
    coupon: String!
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

  purchase: async (parent, { input }, context, info) => {
    return userService.purchase({ ...input })
  }
})

export default {
  typeDefs,
  mutation
}
