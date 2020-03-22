import { resolvers as query } from './query'
import { resolvers as mutation } from './mutation'
import { resolver as image } from './photo'

export const queryResolvers = query
export const mutationResolvers = mutation
export const imageResolver = image
