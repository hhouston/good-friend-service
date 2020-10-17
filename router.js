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

import { createMongoClient } from './lib/clients'
import { signToken, validateToken, getTokenExpiry } from './lib/services'
import { createGenId } from './lib/helper'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
import { isNil, head, isEmpty } from 'ramda'

const router = new Router()
const port = config.get('port')
const jwtSecret = config.get('jwtSecret')
const mongo = config.get('mongo')
const mailerConfig = config.get('mailerConfig')

export const createRouter = () => {
  const router = new Router()

  router.post('/login', koaBody(), async (ctx) => {
    try {
      const mongoClient = createMongoClient({ url: mongo.url })
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

      ctx.body = { token, expiresAt: exp }
    } catch (err) {
      throw err
    }
  })

  router.post('/signup', koaBody(), async (ctx) => {
    const mongoClient = createMongoClient({ url: mongo.url })
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

    const saltedPassword = await bcrypt.hash(password, 12)
    const userResp = await table.updateOne(query, {
      $set: {
        email,
        password: saltedPassword,
        firstName
      }
    })

    const token = signToken({ jwtSecret, email })

    const { exp } = getTokenExpiry({ jwtSecret, token })

    ctx.body = { token, expiresAt: exp }
  })

  router.post('/reset', koaBody(), async (ctx) => {
    try {
      const { email } = ctx.request.body
      const mongoClient = createMongoClient({ url: mongo.url })
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
