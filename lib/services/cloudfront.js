import { createHmac } from 'crypto'

import { join, pipe, map, apply, replace } from 'ramda'

const hmacRegexes = [
  [/\+/g, '-'],
  [/\//g, '_']
]

const cleanHmac = pipe(...map(apply(replace), hmacRegexes))

const getHmac = (key, value) => {
  const hmac = createHmac('sha1', key).update(value)
  return cleanHmac(hmac.digest('base64'))
}

export const createGetImageUrl = ({ baseUrl, securityKey, log }) => ({
  id,
  width,
  height,
  watermark
}) => {
  log.info({ id }, 'Get Image Url: Start')

  const wmPath = `${width}x${height}/smart/08eYlPtsTuHGSZCO3oRI`
  const wmHash = getHmac(securityKey, wmPath)
  const wmUrl = join('/', [baseUrl, wmHash, wmPath])
  const wmImage =
    'https://s3-us-west-1.amazonaws.com/burst-photos/public/watermark2.png'
  const wm = `filters:watermark(${wmImage},center,center,50,90,70)/`

  const imagePath = `${width}x${height}/smart/${
    watermark == true ? wm : ''
  }${id}`
  const hash = getHmac(securityKey, imagePath)
  const url = join('/', [baseUrl, hash, imagePath])

  log.info({ url }, 'Get Image Url: Success')

  return { url, width, height }
}

export const getDownloadUrl = ({ imageId }) => {
  return `https://s3-us-west-1.amazonaws.com/burst-photos/${imageId}`
}
