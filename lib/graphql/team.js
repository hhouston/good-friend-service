import gql from 'graphql-tag'

export const typeDefs = gql`
  type Team {
    id: String!
    name: String!
    thumbnail: String
    roster: [Player!]
  }

  input TeamInput {
    name: String!
    roster: [PlayerInput!]
  }

  input UpdateTeamFields {
    name: String
    thumbnail: String
    roster: [PlayerInput!]
  }

  input UpdateTeamInput {
    id: ID!
    fields: UpdateTeamFields!
  }

  input PlayerInput {
    id: String
    name: String
    number: String
    thumbnail: String
    info: String
  }

  type Player {
    id: String
    name: String
    number: String
    thumbnail: String
    info: String
  }
`

export const query = ({ teamService }) => ({
  getTeams: (parent, args, context, info) => {
    return teamService.getTeams()
},

  getTeam: (parent, { teamId }, context, info) => {
    return teamService.getTeam({ teamId })
  }
})

export const mutation = ({ teamService }) => ({
  addTeam: (parent, { team }, context, info) => {
    return teamService.addTeam({ team })
  },

  updateTeam: (parent, { team }, context, info) => {
    return teamService.updateTeam({ ...team })
  }
})

export default {
  typeDefs,
  mutation,
  query
}
