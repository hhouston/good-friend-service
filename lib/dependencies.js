import fs from 'fs'
import util from 'util'

import createLogger from '@meltwater/mlabs-logger'

import { createContainer, aliasTo, asClass, asFunction, asValue } from 'awilix'

import config from 'config'

import {
  queryResolvers,
  mutationResolvers,
  imageResolver,
  friendResolver,
  User,
  Friend,
  Event,
  Gift,
  Image,
  Photo,
  Stripe
} from './graphql'

import {
  UserService,
  FriendService,
  EventService,
  GiftService,
  PhotoService,
  MongoService,
  StripeService,
  S3Service,
  createGetImageUrl
} from './services'

import { createMongoClient, createS3Client } from './clients'
import { createGenId } from './helper'
import createApp from './app'

export default () => {
  const container = createContainer()

  const logOptions = {
    outputMode: 'pretty',
    name: 'thank-you'
  }

  container.register({
    log: asFunction(() => createLogger(logOptions)),

    // graphql
    ImageQuery: asFunction(Image.query),
    PhotoQuery: asFunction(Photo.query),
    PhotoMutation: asFunction(Photo.mutation),
    UserMutation: asFunction(User.mutation),
    UserQuery: asFunction(User.query),
    FriendMutation: asFunction(Friend.mutation),
    FriendQuery: asFunction(Friend.query),
    EventMutation: asFunction(Event.mutation),
    EventQuery: asFunction(Event.query),
    GiftMutation: asFunction(Gift.mutation),
    GiftQuery: asFunction(Gift.query),
    StripeQuery: asFunction(Stripe.query),
    Query: asFunction(queryResolvers),
    Mutation: asFunction(mutationResolvers),
    Photo: asFunction(imageResolver),
    Event: asFunction(friendResolver),

    // services
    userService: asClass(UserService)
      .inject(() => ({
        port: config.get('port'),
        jwtSecret: config.get('jwtSecret'),
        saltRounds: config.get('saltRounds'),
        mailerConfig: config.get('mailerConfig')
      }))
      .scoped(),
    friendService: asClass(FriendService).scoped(),
    eventService: asClass(EventService).scoped(),
    giftService: asClass(GiftService).scoped(),
    mongoService: asClass(MongoService).scoped(),
    photoService: asClass(PhotoService).scoped(),
    stripeService: asClass(StripeService)
      .inject(() => ({ apiKey: config.get('stripeApiKey') }))
      .scoped(),
    s3Service: asClass(S3Service).scoped(),

    //functions
    getImageUrl: asFunction(createGetImageUrl)
      .inject(() => config.get('cloudfront'))
      .scoped(),

    // clients
    s3Client: asFunction(createS3Client)
      .inject(() => config.get('s3'))
      .singleton(),
    mongoClient: asFunction(createMongoClient)
      .inject(() => config.get('mongo'))
      .singleton(),

    genId: asFunction(createGenId).singleton(),
    app: asFunction(createApp).singleton()
  })

  return container
}
