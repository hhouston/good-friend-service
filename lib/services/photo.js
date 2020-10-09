import { head, isEmpty } from 'ramda'

export class PhotoService {
  constructor({ mongoService, s3Service, getImageUrl, genId, log }) {
    this.mongoService = mongoService
    this.s3Service = s3Service
    this.getImageUrl = getImageUrl
    this.genId = genId
    this.log = log.child({
      service: 'photo'
    })
  }

  async getById({ ids }) {
    try {
      this.log.info({ ids }, 'Get Photos By Ids: Start')

      const photos = ids.map(async (id) => {
        const photo = await this.mongoService.fetch({
          query: { id },
          collection: 'photos'
        })

        if (isEmpty(photo))
          this.log.warn({ id }, 'Get Photos By Ids: Not Found')

        return head(photo)
      })

      if (isEmpty(photos)) return 'Photos not found'

      return photos
    } catch (err) {
      this.log.error({ err }, 'Get Photos By Ids: Fail')
      throw err
    }
  }

  async getByTeam({ teamId }) {
    try {
      this.log.info({ teamId }, 'Get Photos By Team: Start')

      const photos = await this.mongoService.fetch({
        query: teamId,
        collection: 'photos'
      })

      return photos
    } catch (err) {
      this.log.error({ err }, 'Get Photos By Team: Fail')
      throw err
    }
  }

  async getByPlayer({ playerId }) {
    try {
      this.log.info({ playerId }, 'Get Photos By Player: Start')

      const photos = await this.mongoService.fetch({
        query: { playerId },
        collection: 'photos'
      })

      return photos
    } catch (err) {
      this.log.error({ err }, 'Get Photos By Player: Fail')
      throw err
    }
  }

  async getDownloadUrl({ ids: photoIds }) {
    try {
      this.log.info({ photoIds }, 'Get Download Urls: Start')

      const pUrls = await photoIds.map((id) => {
        return this.s3Service.createDownloadUrl({ imageId: id })
      })

      const urls = await Promise.all(pUrls).then((url) => {
        return url
      })
      this.log.info({ photoIds }, 'Get Download Urls: Success')

      return urls
    } catch (err) {
      this.log.error({ err }, 'Get Download Urls: Fail')
      throw err
    }
  }

  async addPhotos({ photos }) {
    try {
      this.log.info({ photos }, 'Add Photos: Start')

      const { teamId, eventId, playerId } = photos

      const files = await Promise.all(photos.files)

      for (let photo of files) {
        const id = this.genId()
        const metadata = { id, teamId, eventId, playerId }

        const s3Resp = await this.s3Service.add({ photo, metadata })

        if (s3Resp === true) {
          const dbResp = await this.mongoService.add({
            item: metadata,
            collection: 'photos'
          })

          this.log.info({ photoId: id }, 'Photo Uploaded to s3 AND DB')
        }
      }

      this.log.info('Add Photos: Success')
    } catch (err) {
      this.log.error({ err }, 'Add Photos: Fail')
      throw err
    }
  }

  async removePhotos({ ids }) {
    try {
      this.log.info({ ids }, 'Remove Photos: Start')

      for (let id of ids) {
        await this.mongoService.removeOne({
          query: { id },
          collection: 'photos'
        })
      }

      this.log.info({ ids }, 'Remove Photos: Success')

      return 'success'
    } catch (err) {
      this.log.error({ err }, 'Remove Photos: Fail')
      throw err
    }
  }
}
