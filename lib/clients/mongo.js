import { MongoClient } from 'mongodb'

export const createMongoClient = ({
  url,
  auth
}) => {
  let db
  return async () => {
    if (db) return db

    const client = await MongoClient.connect(url, { useNewUrlParser: true, auth })
    db = client.db('burst-photos')

    return db
  }
}
