import { head } from 'ramda'

export class EventService {
  constructor({
    mongoService,
    genId,
    log
  }) {
    this.mongoService = mongoService
    this.genId = genId
    this.log = log.child({
      service: 'event'
    })
  }

  async createEvent ({ event }) {
    try {
      this.log.info({ event }, 'Create Event: Start')

      const id = this.genId()
      const item = { id, ...event }

      const dbResp = await this.mongoService.add({
        item,
        collection: 'event'
      })

      this.log.info({ event: item }, 'Add Event: Success')

      return dbResp
    } catch (err) {
      this.log.error({ err }, 'Add Event: Fail')
      throw err
    }
  }

  async getByUserId ({ userId }) {
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

  async getByEventId ({ eventId }) {
    try {
      this.log.info({ eventId }, 'Get Event: Start')
      console.log('event: ', eventId);
      const event = await this.mongoService.fetch({
        query: { id: eventId },
        collection: 'event'
      })

      return head(event)
    } catch (err) {
      this.log.error({ err }, 'Get Event: Fail')
      throw err
    }
  }

  async updateEvent ({ id, fields }) {
    try {
      this.log.info({ eventId: id, fields }, 'Update Event: Start')

      const eventResp = await this.mongoService.updateOne({
        query: { id },
        update: { $set: { ...fields } },
        collection: 'event'
      })

      console.log('event resp update: ', eventResp);
      return eventResp
    } catch (err) {
      this.log.error({ err }, 'Update Event: Fail')
      throw err
    }
  }
}
