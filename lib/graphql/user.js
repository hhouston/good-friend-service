import gql from 'graphql-tag'

export const typeDefs = gql`
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
