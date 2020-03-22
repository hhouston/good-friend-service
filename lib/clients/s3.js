import AWS from 'aws-sdk'

export const createS3Client = ({
  accessKeyId,
  secretAccessKey
}) => {
  let client
  return async () => {
    if (client) return client

    AWS.config.update({ accessKeyId, secretAccessKey })
    const s3 = new AWS.S3()

    return s3
    // return s3.createClient({
    //   maxAsyncS3: 20,
    //   s3RetryCount: 3,
    //   s3RetryDelay: 1000,
    //   multipartUploadThreshold: 20971520,
    //   multipartUploadSize: 15728640,
    //   s3Options: {
    //     accessKeyId,
    //     secretAccessKey,
    //   }
    // })
  }
}
