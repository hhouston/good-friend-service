import gql from 'graphql-tag'

export const typeDefs = gql`
  input CouponInput {
    code: ID!
    teamId: ID!
    eventId: ID!
  }
`

export const mutation = ({ couponService }) => ({
  createCoupon: async (parent, { coupon }, context, info) => {
    return couponService.create(coupon)
  }
})

export default {
  typeDefs,
  mutation
}
