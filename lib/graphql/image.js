import gql from 'graphql-tag'

export const typeDefs = gql`
  type Image {
    url: String!
    width: Int!
    height: Int!
  }
`

export const query = ({ getImageUrl, s3Service }) => ({
  get: async ({ id }, { spec }, context, info) => {
    return getImageUrl({ id, ...spec })
  }
})

export default {
  query,
  typeDefs
}
