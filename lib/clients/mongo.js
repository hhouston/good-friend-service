import { MongoClient } from 'mongodb'

export const createMongoClient = ({ url }) => {
  let db
  console.log('create mongo client: ', url);
  return async () => {
    console.log('db creat mongo: ', db);
    if (db) return db

    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = client.db('thank-you')

    return db
  }
}
