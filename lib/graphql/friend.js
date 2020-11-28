import gql from 'graphql-tag'

export const typeDefs = gql`
  enum FriendType {
    HUSBAND
    WIFE
    SON
    DAUGHTER
    MOM
    DAD
    BROTHER
    SISTER
    GRANDMOTHER
    GRANDFATHER
    NIECE
    NEPHEW
    COUSIN
    OTHER
  }

  input FriendInput {
    userId: ID
    type: FriendType
    name: String
    gender: String
    age: Int
    interests: [String]
  }

  input UpdateFriendFields {
    type: FriendType
    name: String
    gender: String
    age: Int
    interests: [String]
  }

  input UpdateFriendInput {
    id: ID!
    fields: UpdateFriendFields!
  }

  type Friend {
    id: ID!
    userId: ID
    type: FriendType
    name: String
    gender: String
    age: Int
    interests: [String]
  }
`

export const query = ({ friendService }) => ({
  getFriendById: (parent, { friendId }, context, info) => {
    return friendService.getFriendById({ friendId })
  },

  getFriendsByUserId: (parent, { userId }, context, info) => {
    return friendService.getFriendsByUserId({ userId })
  }
})

export const mutation = ({ friendService }) => ({
  addFriend: async (parent, { friend }, context, info) => {
    return friendService.addFriend({ friend })
  },

  addFriends: async (parent, { friends }, context, info) => {
    return friendService.addFriends({ friends })
  },

  updateFriend: async (parent, { friend }, context, info) => {
    return friendService.updateFriend({ ...friend })
  }
})

export default {
  typeDefs,
  query,
  mutation
}
