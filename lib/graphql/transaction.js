import gql from 'graphql-tag'

export const typeDefs = gql`
  type Test {
    id: String
  }

  type Transaction {
    id: ID!
    userId: ID!
    eventId: ID!
    name: String!
    description: String
    type: GiftType
    price: String
    currency: CurrencyType
    url: String!
    image: String
    approved: StatusType
    deleted: Boolean
  }
`

export const query = ({ transactionService }) => ({
  getAllTransactions: (parent, args, context, info) => {
    return transactionService.post()
  }
})

export const mutation = ({ transactionService }) => ({
  addTransacion: (parent, args, context, info) => {
    return transactionService.post()
  }
})

export default {
  typeDefs,
  query,
  mutation
}
