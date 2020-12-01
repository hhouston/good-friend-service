import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'
import cors from '@koa/cors'
import { apolloUploadKoa } from 'apollo-upload-server'
import { ApolloServer, gql, GraphQLUpload } from 'apollo-server-koa'
import { createContainer } from 'awilix'
import { scopePerRequest } from 'awilix-koa'

import config from 'config'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
import { isNil, head, isEmpty } from 'ramda'

import { createDependencies } from './lib'
import { typeDefs } from './lib/graphql'
import { createMongoClient } from './lib/clients'
import { signToken, validateToken, getTokenExpiry } from './lib/services'
import { createGenId } from './lib/helper'

const dependencies = createDependencies()

const app = new Koa()
const port = config.get('port')
const jwtSecret = config.get('jwtSecret')
const mongo = config.get('mongo')
const mailerConfig = config.get('mailerConfig')

// import { createRouter } from './router'
const createRouter = () => {
  const router = new Router()

  router.post('/login', koaBody(), async (ctx) => {
    try {
      console.log('Login User: Start');
      const mongoClient = createMongoClient(mongo)
      const db = await mongoClient()
      const table = db.collection('user')
      const { email, password, type } = ctx.request.body
      const query = { email }
      const cursor = isNil(query) ? await table.find() : await table.find(query)

      const items = await cursor.toArray()
      if (isEmpty(items)) {
        console.log(`No user Found with Email: ${email}`)
        ctx.body = { error: `No user Found with Email: ${email}` }
        return
      }

      const user = head(items)
      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        console.log(`Incorrect password`)
        ctx.body = { error: 'Incorrect password' }
        return
       }

      const token = signToken({ jwtSecret, email })

      const { exp } = getTokenExpiry({ jwtSecret, token })

      ctx.body = { token, expiresAt: exp,  userId: user.id }
      return


    } catch (err) {
      throw err
    }
  })

  router.post('/signup', koaBody(), async (ctx) => {
    try {
      console.log('Sign Up User: Start');
      const mongoClient = createMongoClient(mongo)
      const db = await mongoClient()
      const table = db.collection('user')
      const { email, password, type, firstName } = ctx.request.body

      const query = { email }
      const cursor = isNil(query) ? await table.find() : await table.find(query)

      const items = await cursor.toArray()

      if (!isEmpty(items)) {
        console.log(`Account with email ${email} already exists`)
        ctx.body = { error: `Account with email ${email} already exists` }
        return
      }

      const genId = createGenId()
      const userId = genId()
      const saltedPassword = await bcrypt.hash(password, 12)

      const userResp = await table.insertOne({
        id: userId,
        email,
        password: saltedPassword,
        firstName
      })

      const token = signToken({ jwtSecret, email })

      const { exp } = getTokenExpiry({ jwtSecret, token })

      ctx.body = { token, expiresAt: exp, userId }
    } catch(err) {
      console.log('errr: ', err);
      throw err
    }
  })

  router.post('/reset', koaBody(), async (ctx) => {
    try {
      console.log('Reset Password: Start');
      const { email } = ctx.request.body
      const mongoClient = createMongoClient(mongo)
      const db = await mongoClient()

      const table = db.collection('user')
      const query = { email }
      const cursor = isNil(query) ? await table.find() : await table.find(query)
      const items = await cursor.toArray()

      if (isEmpty(items)) {
        ctx.body = { error: `No user Found with Email: ${email}` }
        return
      }
      const genId = createGenId()
      const tempPassword = genId()
      const saltedPassword = await bcrypt.hash(tempPassword, 12)
      const userResp = await table.updateOne(query, {
        $set: { password: saltedPassword }
      })

      const transporter = nodemailer.createTransport(mailerConfig)

      const info = await transporter.sendMail({
        from: '"Thank You Gift" <support@thankyougift.io>',
        to: email,
        subject: 'Reset Password: Thank You Gift',
        text: tempPassword,
        html: `<h1>Temp Password</h1><p>${tempPassword}</p>`
      })

      ctx.body = { password: tempPassword }
    } catch (err) {
      throw err
    }
  })

  return router
}

const router = createRouter()
app.use(cors()).use(router.routes()).use(router.allowedMethods())

export const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: dependencies.resolve('Query'),
    Mutation: dependencies.resolve('Mutation'),
    Photo: dependencies.resolve('Photo'),
    Event: dependencies.resolve('Event'),
    Upload: GraphQLUpload
  },
  context: async ({ ctx }) => {
    const { email } = validateToken({
      jwtSecret,
      header: ctx.request.header
    })

    const mongoClient = createMongoClient({ url: mongo.url })
    const db = await mongoClient()
    const table = db.collection('user')
    const query = { email }
    const cursor = isNil(query) ? await table.find() : await table.find(query)
    const items = await cursor.toArray()

    if (isEmpty(items)) {
      console.log(`No user Found with Email: ${email}`)
      ctx.body = { error: `No user Found with Email: ${email}` }
      return
    }

    const user = head(items)

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
    console.log('format error: ', err)
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
