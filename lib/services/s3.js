import fs from 'fs'
import path from 'path'

import { isNilOrEmpty } from 'ramda'

export class S3Service {
  constructor ({
    s3Client,
    genId,
    log
  }) {
    this.s3Client = s3Client
    this.genId = genId
    this.log = log.child({
      service: 'mongo'
    })
  }

  async add ({ photo, metadata }) {
    try {
      this.log.info({ photo, metadata }, 'Add to s3 Bucket: Start')
      const { createReadStream, mimetype } = photo

      const stream = await createReadStream()
      const params = {
        Bucket: 'burst-photos',
        Key: metadata.id,
        Body: stream,
        ContentType: mimetype
      }

      const s3 = await this.s3Client()
      await s3.upload(params).promise()

      return true

    } catch (err) {
      this.log.error({ err }, 'Add to s3 Bucket: Fail')
      return false
    }
  }

  async createDownloadUrl ({ imageId }) {
    try {
      this.log.info({ imageId }, 'Create Download Url: Start')

      const s3 = await this.s3Client()

      const url = s3.getSignedUrl('getObject', {
          Bucket: 'burst-photos',
          Key: imageId,
          Expires: 60 * 60 * 24 * 7 * 52 // seconds (1 year)
      })

      return url
    } catch (err) {
      this.log.error({ err }, 'Create Download Url: Fail')
      throw err
    }
  }
}
