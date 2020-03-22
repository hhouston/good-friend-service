import gql from 'graphql-tag'

export const typeDefs = gql`
  type Test {
    id: String
  }
`

export const query = ({ stripeService }) => ({
  post: (parent, args, context, info) => {
    return stripeService.post()
  }
})

export default {
  typeDefs,
  query
}
