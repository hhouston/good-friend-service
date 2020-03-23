import gql from 'graphql-tag'

export const typeDefs = gql`
  input FacebookOptions {
    email: String!
    accessToken: String!
  }

  type FacebookFriend {
    id: ID!
    email: String!
    imageUrl: String!
    birthday: String!
  }
`

export const query = ({ facebookService }) => ({
  getTopFriends: async (parent, { options }, context, info) => {
    return facebookService.getTopFriends(options)
  }
})

export default {
  typeDefs,
  query
}
