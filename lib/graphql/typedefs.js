import { typeDefs as user } from './user'
import { typeDefs as friend } from './friend'
import { typeDefs as event } from './event'
import { typeDefs as gift } from './gift'
import { typeDefs as image } from './image'
import { typeDefs as photo } from './photo'
import { typeDefs as stripe } from './stripe'
import { typeDefs as query } from './query'
import { typeDefs as mutation } from './mutation'

export const typeDefs = [
  user, friend, event, gift, image,
  photo, stripe, query, mutation
]
