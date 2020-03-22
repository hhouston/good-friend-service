import gql from 'graphql-tag'

export const typeDefs = gql`
  input EventInput {
    organizationId: ID
    teamId: ID!
    name: String!
    date: String
  }
`

export const mutation = ({ eventService }) => ({
  createEvent: async (parent, { event }, context, info) => {
    return eventService.create(event)
  }
})

export default {
  typeDefs,
  mutation
}
