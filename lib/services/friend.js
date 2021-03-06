import { map, head } from 'ramda'

export class FriendService {
  constructor({ mongoService, genId, log }) {
    this.mongoService = mongoService
    this.genId = genId
    this.log = log.child({
      service: 'friend'
    })
  }

  async addFriend({ friend }) {
    try {
      this.log.info({ friend }, 'Create Friend: Start')

      const id = this.genId()
      const item = { id, ...friend }

      const dbResp = await this.mongoService.add({
        item,
        collection: 'friend'
      })

      this.log.info({ friend: item }, 'Add Friend: Success')

      return dbResp
    } catch (err) {
      this.log.error({ err }, 'Add Friend: Fail')
      throw err
    }
  }

  async addFriends({ friends, userId }) {
    try {
      this.log.info('Add Friends: Start')

      const items =  map((friend) => {
        console.log('fffffff: ', friend);
        const id = this.genId()
        return { id, userId, ...friend }
      }, friends)

      const dbResp = await this.mongoService.addMany({
        items,
        collection: 'friend'
      })

      this.log.info('Add Friends: Success')

      return items
      // return dbResp
    } catch (err) {
      this.log.error({ err }, 'Add Friends: Fail')
      throw err
    }
  }

  async getFriendById({ friendId }) {
    try {
      this.log.info({ friendId }, 'Get Friend: Start')

      const friend = await this.mongoService.fetch({
        query: { id: friendId },
        collection: 'friend'
      })

      this.log.info({ friend }, 'Get Friend: Success')

      return head(friend)
    } catch (err) {
      this.log.error({ err }, 'Get Friend: Fail')
      throw err
    }
  }

  async getFriendsByUserId({ userId }) {
    try {
      this.log.info({ userId }, 'Get Friend(s) By User ID: Start')

      const friend = await this.mongoService.fetch({
        query: { userId },
        collection: 'friend'
      })

      return friend
    } catch (err) {
      this.log.error({ err, userId }, 'Get Friend(s) By User ID: Fail')
      throw err
    }
  }

  async updateFriend({ id, fields }) {
    try {
      this.log.info({ friendId: id, fields }, 'Update Friend: Start')

      const friendResp = await this.mongoService.updateOne({
        query: { id },
        update: { $set: { ...fields } },
        collection: 'friend'
      })

      return friendResp
    } catch (err) {
      this.log.error({ err }, 'Update Friend: Fail')
      throw err
    }
  }
}
