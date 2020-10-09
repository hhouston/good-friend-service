import Koa from 'koa'
import Router from 'koa-router'
import cors from '@koa/cors'
import { apolloUploadKoa } from 'apollo-upload-server'

import {
  ApolloServer,
  gql,
  GraphQLUpload
} from 'apollo-server-koa'

import config from 'config'

import { createContainer } from 'awilix'
import { scopePerRequest } from 'awilix-koa'

import { typeDefs } from './lib/graphql'

import { createDependencies } from './lib'
import { validateToken } from './lib/services'

const dependencies = createDependencies()

const app = new Koa()
const router = new Router()
const port = config.get('port')
const jwtSecret = config.get('jwtSecret')

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())


router.get('/login', (ctx, next) => {
  // ctx.router available
  console.log('login')
})

const server = new ApolloServer({
  typeDefs,
  resolvers: {
      Query: dependencies.resolve('Query'),
      Mutation: dependencies.resolve('Mutation'),
      Photo: dependencies.resolve('Photo'),
      Upload: GraphQLUpload
   },
   // context: ({ ctx }) => validateToken({ jwtSecret, token: ctx.request.header }),
   onHealthCheck: () => {
      return new Promise((resolve, reject) => {
        // Replace the `true` in this conditional with more specific checks!
        if (true) {
          resolve();
        } else {
          reject();
        }
      });
    },
   formatError: err => {
      return new Error(err);
    },
   uploads: {
      maxFileSize: 2000000000,
      maxFiles: 30
    }
})

server.applyMiddleware({ app })

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
)
