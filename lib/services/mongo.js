import { isNil } from 'ramda'

export class MongoService {
  constructor ({
    mongoClient,
    log
  }) {
    this.mongoClient = mongoClient
    this.log = log.child({
      service: 'mongo'
    })
  }

  async add ({ item, collection }) {
    try {
      this.log.info({ item, collection }, 'Add to Database: Start')

      const db = await this.mongoClient()
      const table = db.collection(collection)

      const resp = await table.insertOne(item)

      this.log.info({ resp }, 'Add to Database: Success')

      return 'success'
    } catch (err) {
      this.log.error({ err }, 'Add to Database: Fail')
      throw err
    }
  }

  async fetch ({ query = null, collection }) {
    try {
      this.log.info({ query, collection }, 'Fetch from Database: Start')

      const db = await this.mongoClient()
      const table = db.collection(collection)

      const cursor = isNil(query)
        ? await table.find()
        : await table.find(query)

      const items = await cursor.toArray()

      this.log.info({ query, collection }, 'Fetch from Database: Success')

      return items
    } catch (err) {
      this.log.error({ err }, 'Fetch from Database: Fail')
      throw err
    }
  }

  async updateOne ({ query, update, collection }) {
    try {
      this.log.info({ update, collection }, 'Update Item: Start')

      const db = await this.mongoClient()
      const table = db.collection(collection)

      const { result } = await table.updateOne(
        query,
        update
      )

      this.log.info({ update, collection }, 'Update Item: Success')

      return 'success'
    } catch (err) {
      this.log.error({ err }, 'Update Item: Fail')
      throw err
    }
  }

  async removeOne ({ query, collection }) {
    try {
      this.log.info({ query, collection }, 'Remove Item: Start')

      const db = await this.mongoClient()
      const table = db.collection(collection)

      // result should be { n: 1, ok: 1 }
      // record not found is { n: 0, ok: 1 }
      const { result } = await table.remove(query)

      this.log.info({ query, collection }, 'Remove Item: Success')
    } catch (err) {
      this.log.error({ err }, 'Remove Item: Fail')
      throw err
    }
  }
}
