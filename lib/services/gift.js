import { head } from 'ramda'

export class GiftService {
  constructor({
    mongoService,
    genId,
    log
  }) {
    this.mongoService = mongoService
    this.genId = genId
    this.log = log.child({
      service: 'gift'
    })
  }

  async addGift({ gift }) {
    try {
      this.log.info({ gift }, 'Create Gift: Start')

      const id = this.genId()
      const item = { id, ...gift }

      const dbResp = await this.mongoService.add({
        item,
        collection: 'gift'
      })

      this.log.info({ gift: item }, 'Add Gift: Success')

      return dbResp
    } catch (err) {
      this.log.error({ err }, 'Add Gift: Fail')
      throw err
    }
  }

  async getGiftById ({ giftId }) {
    try {
      this.log.info({ giftId }, 'Get Gift: Start')

      const gift = await this.mongoService.fetch({
        query: { id: giftId },
        collection: 'gift'
      })

      this.log.info({ gift }, 'Get Gift: Success')

      return head(gift)
    } catch (err) {
      this.log.error({ err }, 'Get Gift: Fail')
      throw err
    }
  }

  async getGiftsByEventId ({ eventId }) {
    try {
      this.log.info({ eventId }, 'Get Gift(s) By Event ID: Start')

      const gifts = await this.mongoService.fetch({
        query: { eventId },
        collection: 'gift'
      })

      return gifts
    } catch (err) {
      this.log.error({ err, eventId }, 'Get Gift(s) By Event ID: Fail')
      throw err
    }
  }

  async getGiftsByUserId ({ userId }) {
    try {
      this.log.info({ userId }, 'Get Gift(s) By User ID: Start')

      const gifts = await this.mongoService.fetch({
        query: { userId },
        collection: 'gift'
      })

      return gifts
    } catch (err) {
      this.log.error({ err, userId }, 'Get Gift(s) By User ID: Fail')
      throw err
    }
  }

  async updateGift ({ id, fields }) {
    try {
      this.log.info({ giftId: id, fields }, 'Update Gift: Start')

      const giftResp = await this.mongoService.updateOne({
        query: { id },
        update: { $set: { ...fields } },
        collection: 'gift'
      })

      return giftResp
    } catch (err) {
      this.log.error({ err }, 'Update Gift: Fail')
      throw err
    }
  }
}
