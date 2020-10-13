import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'
import cors from '@koa/cors'
import { apolloUploadKoa } from 'apollo-upload-server'

import { ApolloServer, gql, GraphQLUpload } from 'apollo-server-koa'

import config from 'config'

import { createContainer } from 'awilix'
import { scopePerRequest } from 'awilix-koa'

import { typeDefs } from './lib/graphql'

import { createDependencies } from './lib'
import { MongoService } from './lib/services'
import { createMongoClient } from './lib/clients'
import { validateToken } from './lib/services'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { isNil, head, isEmpty } from 'ramda'

const dependencies = createDependencies()

const app = new Koa()
const router = new Router()
const port = config.get('port')
const jwtSecret = config.get('jwtSecret')
const mongo = config.get('mongo')

router.post('/login', koaBody(), async (ctx) => {
  try {

    const { email, password, type } = ctx.request.body
    const mongoClient = createMongoClient({ url: mongo.url })
    const db = await mongoClient()
    const table = db.collection('user')
    const query = { email }
    const cursor = isNil(query) ? await table.find() : await table.find(query)

    const items = await cursor.toArray()
    if (isEmpty(items)) {
      throw new Error(`No user Found with Email: ${email}`)
    }
    const user = head(items)
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw new Error('Incorrect password')
    }

    const token = jwt.sign({ email }, jwtSecret, {
      subject: email,
      expiresIn: '14d'
    })

    ctx.body = { token }
  } catch (err) {
    // this.log.error({ err }, 'Login User: Fail')
    throw err
  }
})

router.post('/signup', koaBody(), (ctx) => {
  const { type } = ctx.request.body
  console.log('type: ', type)
  ctx.body = {
    jwtToken: 'asdfa'
  }
})

app.use(cors()).use(router.routes()).use(router.allowedMethods())

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: dependencies.resolve('Query'),
    Mutation: dependencies.resolve('Mutation'),
    Photo: dependencies.resolve('Photo'),
    Upload: GraphQLUpload
  },
  context: ({ ctx }) => {
    const user = validateToken({
      jwtSecret,
      token: ctx.request.header
    })

    console.log('user::: ', user);

    return { user }
  },
  onHealthCheck: () => {
    return new Promise((resolve, reject) => {
      // Replace the `true` in this conditional with more specific checks!
      if (true) {
        resolve()
      } else {
        reject()
      }
    })
  },
  formatError: (err) => {
    return new Error(err)
  },
  uploads: {
    maxFileSize: 2000000000,
    maxFiles: 30
  }
})

server.applyMiddleware({ app })

app.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
)
