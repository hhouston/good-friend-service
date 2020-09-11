import Koa from 'koa'
import { apolloUploadKoa } from 'apollo-upload-server'

import {
  ApolloServer,
  gql,
  GraphQLUpload
} from 'apollo-server-koa'
import cors from '@koa/cors'

import config from 'config'

import { createContainer } from 'awilix'
import { scopePerRequest } from 'awilix-koa'

import { typeDefs } from './lib/graphql'

import { createDependencies } from './lib'
import { MongoService } from './lib/services'

const dependencies = createDependencies()

const app = new Koa()
const jwtToken = config.get('jwtToken')
const burstCoupon = config.get('burstCoupon')
const port = config.get('port')
var options = {
    origin: 'https://thankyougift.io'
};
/*app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  await next();
});*/
// app.use(cors())
app.use(cors(options))

const server = new ApolloServer({
  typeDefs,
  resolvers: {
      Query: dependencies.resolve('Query'),
      Mutation: dependencies.resolve('Mutation'),
      Photo: dependencies.resolve('Photo'),
      Upload: GraphQLUpload
   },
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
   formatError: error => {
      console.log(error);
      return new Error('Internal server error');
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
