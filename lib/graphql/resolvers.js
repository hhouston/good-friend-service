import { resolvers as query } from './query'
import { resolvers as mutation } from './mutation'
import { resolver as image } from './photo'
import { resolver as friend } from './event'

export const queryResolvers = query
export const mutationResolvers = mutation
export const imageResolver = image
export const friendResolver = friend
