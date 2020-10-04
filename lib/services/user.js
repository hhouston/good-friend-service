import jsonwebtoken from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { head, isEmpty } from 'ramda'
import { unauthorized } from 'boom'
import bcrypt from 'bcrypt'

export class UserService {
  constructor({
    mongoService,
    stripeService,
    s3Service,
    emailAuth,
    burstCoupon,
    saltRounds,
    jwtToken,
    genId,
    log
  }) {
    this.mongoService = mongoService
    this.stripeService = stripeService
    this.s3Service = s3Service
    this.emailAuth = emailAuth
    this.burstCoupon = burstCoupon
    this.saltRounds = saltRounds
    this.jwtToken = jwtToken
    this.genId = genId
    this.log = log.child({
      service: 'user'
    })
  }

  async signUp ({ email, password, firstName, lastName }) {
    try {
      this.log.info({ email }, 'Sign Up: Start')


      const saltedPassword = await bcrypt.hash(password, this.saltRounds)

      await this.saveUser({
        email,
        saltedPassword,
        firstName,
        lastName
      })

      const token = jsonwebtoken.sign({ email }, this.jwtToken, { expiresIn: '1y' })
      return token
    } catch (err) {
      this.log.error({ err }, 'Sign Up: Fail')
      throw err
    }
  }

  async login ({ email, password }) {
    try {
      this.log.info({ email }, 'Login User: Start')

      const getUserResp = await this.getUserByEmail({ email })
      const user = head(getUserResp)

      if (!user) {
        throw new Error('No user found')
      }

      const isValid = await bcrypt.compare(password, user.saltedPassword)

      if (!isValid) {
        throw new Error('Incorrect password')
      }

      const token = jsonwebtoken.sign({ email }, this.jwtToken, { expiresIn: '1y' })
      return token
    } catch (err) {
      this.log.error({ err }, 'Login User: Fail')
      throw err
    }
  }

  async getUserByEmail({ email }) {
    try {
      this.log.info({ email }, 'Get User By Email: Start')

      const user = await this.mongoService.fetch({
        query: { email },
        collection: 'user'
      })

      if (!user) {
        this.log.info({ email }, 'Get User: Not Found')
        return
      }

      this.log.info({ email }, 'Get User By Email: Succes')

      return user
    } catch(err) {
      this.log.error({ err }, 'Get User by Email: Fail')
      throw err
    }
  }

  async saveUser ({
    email,
    saltedPassword,
    firstName,
    lastName
  }) {
    try {
      this.log.info('Save User: Start')

      const user = await this.mongoService.fetch({
        query: { email },
        collection: 'user'
      })

      if (!isEmpty(user)) {
        this.log.info({ email }, 'Save User: User Exists')
        return
      }

      const userResp = await this.mongoService.add({
        item: {
          id: this.genId(),
          email,
          saltedPassword,
          firstName,
          lastName
        },
        collection: 'user'
      })

      this.log.info({ email }, 'Save User: Success')

    } catch (err) {
      this.log.error({ err }, 'Save User: Fail')
      throw err
    }
  }

  async purchase ({ email, amount, photoIds, token }) {
    try {
      this.log.info({ email, amount, photoIds }, 'Create Purchase: Start')

      const chargeResp = await this.stripeService.charge({ amount, token })

      const updateResp = await this.mongoService.updateOne({
        query: { email },
        update: { $push: { purchased: photoIds } },
        collection: 'user'
      })

      const emailResp = await this.email({ email, amount, photoIds })

      this.log.info({ email, amount, photoIds }, 'Create Purchase: Success')

      return 'success'
    } catch (err) {
      if (err.message == `No such token: ${token}`) {
        return 'Invalid Stripe Token'
      }

      this.log.error({ err }, 'Create Purchase: Fail')
      throw err
    }
  }

  async email ({ email, amount, photoIds }) {
    try {
      this.log.info({ email }, 'Email User: Start')

      const pUrls = await photoIds.map(id => {
        return this.s3Service.createDownloadUrl({ imageId: id })
      })

      const urls = await Promise.all(pUrls).then(url => {
        return url
      })

      let urlString = ''
      urls.forEach(url => {
        urlString = urlString.concat(`${url} \n\n`)
      })

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: this.emailAuth
      })

      let info = await transporter.sendMail({
        from: '"Thank You Gift" <hmhouston7@gmail.com>',
        to: email,
        subject: 'Download your photos!',
        text: urlString
      })

      this.log.info({ info }, 'Email User: Success')

      return 'success'
    } catch (err) {
      this.log.error({ err }, 'Email User: Fail')
      throw err
    }
  }

}
