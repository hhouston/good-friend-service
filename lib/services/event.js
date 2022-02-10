import { head, map } from 'ramda'

export class EventService {
  constructor({ mongoService, friendService, genId, log }) {
    this.mongoService = mongoService
    this.friendService = friendService
    this.genId = genId
    this.log = log.child({
      service: 'event'
    })
  }

  async addEvent({ event }) {
    try {
      this.log.info({ event }, 'Create Event: Start')

      let item;
      for (let x in event) {
        const id = this.genId()
        item = { id, ...event[x] }
        console.log('item', item);

        const dbResp = await this.mongoService.add({
          item,
          collection: 'event'
        })

        this.log.info({ event: item }, 'Add Event: Success')
      }


      // return dbResp
      return item
    } catch (err) {
      this.log.error({ err }, 'Add Event: Fail')
      throw err
    }
  }

  async addEvents({ events }) {
    try {
      this.log.info('Add Events: Start')

      const items = map((event) => {
        const id = this.genId()
        return { id, ...event }
      }, events)

      const dbResp = await this.mongoService.addMany({
        items,
        collection: 'event'
      })

      this.log.info('Add Events: Success')

      return dbResp
    } catch (err) {
      this.log.error({ err }, 'Add Events: Fail')
      throw err
    }
  }

  async getByUserId({ userId }) {
    try {
      this.log.info({ userId }, 'Get Event By User ID: Start')

      const events = await this.mongoService.fetch({
        query: { userId },
        collection: 'event'
      })

      return events
    } catch (err) {
      this.log.error({ err, userId }, 'Get Events By User ID: Fail')
      throw err
    }
  }

  async updateEvent({ id, fields }) {
    try {
      this.log.info({ eventId: id, fields }, 'Update Event: Start')

      const eventResp = await this.mongoService.updateOne({
        query: { id },
        update: { $set: { ...fields } },
        collection: 'event'
      })

      return eventResp
    } catch (err) {
      this.log.error({ err }, 'Update Event: Fail')
      throw err
    }
  }
}
