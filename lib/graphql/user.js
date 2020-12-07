import gql from 'graphql-tag'

export const typeDefs = gql`
  type User {
    id: ID!
    createdAt: String
    updatedAt: String
    role: RoleType
    type: String
    email: String!
    password: String
    firstName: String!
    lastName: String
    subscription: SubscriptionType
    imageUrl: String
    address: AddressType
  }

  type AddressType {
    street1: String!
    stree2: String
    city: String!
    state: String!
    zipCode: String!
  }

  enum RoleType {
    ADMIN
    CURATOR
    CUSTOMER
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
    role: RoleType
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
  updateUser: async (parent, { user: { id, fields } }, context, info) => {
    return userService.updateUser({ id, fields })
  },

  resetPassword: async (parent, { email }, context, info) => {
    return userService.resetPassword({ email })
  },

  purchase: async (parent, { input }, context, info) => {
    return userService.purchase({ ...input })
  }
})

export const query = ({ userService }) => ({
  getAllUsers: (parent, args, { user: { role } }, info) => {
    if (role != 'ADMIN') {
      throw new Error('UNAUTHORIZED')
    }

    return userService.getAllUsers()
  },

  // getUsersByCuratorId: (parent, { email }, context, info) => {
  //   return userService.getUsersByCuratorId({ email })
  // },

  getUserById: (parent, { userId }, context, info) => {
    return userService.getUserById({ userId })
  },

  getUserByEmail: (parent, { email }, context, info) => {
    return userService.getUserByEmail({ email })
  }
})

export default {
  typeDefs,
  mutation,
  query
}
