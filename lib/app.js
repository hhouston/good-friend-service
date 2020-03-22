import Koa from 'koa'

export default ({ graphql }) => {
  const app = new Koa()
  app.use(graphql.routes())
  app.use(graphql.allowedMethods())
  return app
}
