import jsonwebtoken from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { head, isEmpty } from 'ramda'
import { unauthorized } from 'boom'
import fbgraph from 'fbgraph'

export class FacebookService {
  constructor({
    mongoService,
    genId,
    log
  }) {
    this.mongoService = mongoService
    this.genId = genId
    this.log = log.child({
      service: 'facebook'
    })
  }

  async getTopFriends ({ email, accessToken }) {
    try {
      this.log.info({ email }, 'Get Top Facebook Friends: Start')

      fbgraph.setAccessToken(accessToken)
      const options = {
          timeout:  3000
        , pool:     { maxSockets:  Infinity }
        , headers:  { connection:  "keep-alive" }
      }

      fbgraph
        .setOptions(options)
        .get('zuck', function(err, res) {
          console.log(res)
        })
      // console.log('xxxxxx', x)
      // const valid = this.burstCoupon === coupon
      //
      // if (!valid) {
      //   throw new Error('Incorrect credentials')
      // }
      //
      // await this.saveUser({ email })
      //
      // const token = jsonwebtoken.sign({ email }, this.jwtToken, { expiresIn: '10y' })
      // return token
    } catch (err) {
      this.log.error({ err }, 'Get Top Facebook Friends: Fail')
      throw err
    }
  }
}
