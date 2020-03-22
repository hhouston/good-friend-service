import { head } from 'ramda'

export class TeamService {
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

  async addTeam ({ team }) {
    try {
      this.log.info({ team }, 'Add Team: Start')

      team.roster.forEach(player => {
        player.id = this.genId()
      })
      const id = this.genId()

      const item = { id, ...team }

      const dbResp = await this.mongoService.add({
        item,
        collection: 'team'
      })

      this.log.info({ team: item }, 'Add Team: Success')

      return dbResp
    } catch (err) {
      this.log.error({ err }, 'Add Team: Fail')
      throw err
    }
  }

  async getTeams () {
    try {
      this.log.info('Get teams: Start')

      const teams = await this.mongoService.fetch({
        collection: 'team'
      })

      return teams
    } catch (err) {
      this.log.error({ err }, 'Get Teams: Fail')
      throw err
    }
  }

  async getTeam ({ teamId }) {
    try {
      this.log.info({ teamId }, 'Get Team: Start')

      const team = await this.mongoService.fetch({
        query: { id: teamId },
        collection: 'team'
      })

      return head(team)
    } catch (err) {
      this.log.error({ err }, 'Get Team: Fail')
      throw err
    }
  }

  async updateTeam ({ id, fields }) {
    try {
      this.log.info({ teamId: id, fields }, 'Update Team: Start')

      const teamResp = await this.mongoService.updateOne({
        query: { id },
        update: { $set: { ...fields } },
        collection: 'team'
      })

      return teamResp
    } catch (err) {
      this.log.error({ err }, 'Update Team: Fail')
      throw err
    }
  }
}
