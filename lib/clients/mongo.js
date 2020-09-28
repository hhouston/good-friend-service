import { MongoClient } from 'mongodb'

export const createMongoClient = ({
  url
}) => {
  let db
  return async () => {
    if (db) return db

    const client = await MongoClient.connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
    db = client.db('thank-you')

    return db
  }
}
