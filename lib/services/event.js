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
      service: 'team'
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

      this.log.info({ event: item }, 'Add Team: Success')

      return dbResp
    } catch (err) {
      this.log.error({ err }, 'Add Team: Fail')
      throw err
    }
  }
  //
  // async getEvents ({ userId }) {
  //   try {
  //     this.log.info('Get Events: Start')
  //
  //     const teams = await this.mongoService.fetch({
  //       collection: 'team'
  //     })
  //
  //     return teams
  //   } catch (err) {
  //     this.log.error({ err }, 'Get Teams: Fail')
  //     throw err
  //   }
  // }
  //
  // async getTeam ({ teamId }) {
  //   try {
  //     this.log.info({ teamId }, 'Get Team: Start')
  //
  //     const team = await this.mongoService.fetch({
  //       query: { id: teamId },
  //       collection: 'team'
  //     })
  //
  //     return head(team)
  //   } catch (err) {
  //     this.log.error({ err }, 'Get Team: Fail')
  //     throw err
  //   }
  // }
  //
  // async updateTeam ({ id, fields }) {
  //   try {
  //     this.log.info({ teamId: id, fields }, 'Update Team: Start')
  //
  //     const teamResp = await this.mongoService.updateOne({
  //       query: { id },
  //       update: { $set: { ...fields } },
  //       collection: 'team'
  //     })
  //
  //     return teamResp
  //   } catch (err) {
  //     this.log.error({ err }, 'Update Team: Fail')
  //     throw err
  //   }
  // }
}
