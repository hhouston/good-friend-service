import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import EmailTemplate from 'email-templates'
import { head, isEmpty, isNil } from 'ramda'
import { unauthorized } from 'boom'
import bcrypt from 'bcrypt'
import path from 'path'

export class UserService {
  constructor({
    mongoService,
    stripeService,
    s3Service,
    mailerConfig,
    saltRounds,
    jwtSecret,
    genId,
    log
  }) {
    this.mongoService = mongoService
    this.stripeService = stripeService
    this.s3Service = s3Service
    this.mailerConfig = mailerConfig
    this.saltRounds = saltRounds
    this.jwtSecret = jwtSecret
    this.genId = genId
    this.log = log.child({
      service: 'user'
    })
  }
  async signUp({ email, password, firstName, lastName }) {
    try {
      this.log.info({ email }, 'Sign Up: Start')
      const user = await this.getUserByEmail({ email })
      if (!isNil(user)) {
        throw new Error(`Account with email ${email} already exists`)
      }
      const saltedPassword = await bcrypt.hash(password, this.saltRounds)
      await this.saveUser({
        email,
        password: saltedPassword,
        firstName,
        lastName
      })
      return jwt.sign({ email }, this.jwtSecret, {
        subject: email,
        expiresIn: '14d'
      })
      return token
    } catch (err) {
      this.log.error({ err }, 'Sign Up: Fail')
      throw err
    }
  }
  async login({ email, password }) {
    try {
      this.log.info({ email }, 'Login User: Start')
      const user = await this.getUserByEmail({ email })
      if (!user) {
        throw new Error(`No user Found with Email: ${email}`)
      }
      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        throw new Error('Incorrect password')
      }
      return jwt.sign({ email }, this.jwtSecret, {
        subject: email,
        expiresIn: '14d'
      })
      return token
    } catch (err) {
      this.log.error({ err }, 'Login User: Fail')
      throw err
    }
  }
  async getUserByEmail({ email }) {
    try {
      this.log.info({ email }, 'Get User By Email: Start')
      const users = await this.mongoService.fetch({
        query: { email },
        collection: 'user'
      })
      if (isEmpty(users)) {
        this.log.info({ email }, 'Get User: Not Found')
        return null
      }
      this.log.info({ email }, 'Get User By Email: Success')
      return head(users)
    } catch (err) {
      this.log.error({ err }, 'Get User by Email: Fail')
      throw err
    }
  }
  async resetPassword({ email }) {
    try {
      this.log.info({ email }, 'Reset Password: Start')
      const user = await this.mongoService.fetch({
        query: { email },
        collection: 'user'
      })
      if (!user) {
        this.log.info({ email }, 'Get User: Not Found')
        return `User with Email: ${email} Not Found.`
      }
      const tempPassword = this.genId()
      console.log('----------', tempPassword)
      const saltedPassword = await bcrypt.hash(tempPassword, this.saltRounds)
      const userResp = await this.mongoService.updateOne({
        query: { email },
        update: { $set: { password: saltedPassword } },
        collection: 'user'
      })
      this.log.info({ email }, 'Reset Password: Success')
      const emailResp = await this.email({ email, password: tempPassword })
      return emailResp
    } catch (err) {
      this.log.error({ err }, 'Reset Password: Fail')
      throw err
    }
  }
  async saveUser({ email, password, firstName, lastName }) {
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
          password,
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
  async updateUser({ id, fields }) {
    try {
      this.log.info({ id }, 'Update User: Start')
      const user = await this.mongoService.fetch({
        query: { id },
        collection: 'user'
      })
      if (!user) {
        this.log.info({ id }, 'Get User: Not Found')
        return
      }
      const { password } = fields
      if (password) {
        fields.password = await bcrypt.hash(password, this.saltRounds)
      }
      const userResp = await this.mongoService.updateOne({
        query: { id },
        update: { $set: { ...fields } },
        collection: 'user'
      })
      this.log.info({ id }, 'Update User: Success')
      return userResp
    } catch (err) {
      this.log.error({ err }, 'Update User: Fail')
      throw err
    }
  }
  async purchase({ email, amount, token }) {
    try {
      this.log.info({ email, amount }, 'Create Purchase: Start')
      const chargeResp = await this.stripeService.charge({ amount, token })
      console.log('chargeResp: ', chargeResp)
      // const updateResp = await this.mongoService.updateOne({
      //   query: { email },
      //   update: { $push: { purchased: photoIds } },
      //   collection: 'user'
      // })
      const emailResp = await this.email({ email })
      this.log.info({ email, amount }, 'Create Purchase: Success')
      return 'success'
    } catch (err) {
      if (err.message == `No such token: ${token}`) {
        return 'Invalid Stripe Token'
      }
      this.log.error({ err }, 'Create Purchase: Fail')
      throw err
    }
  }

  async email({ email, template, locals }) {
    try {
      this.log.info({ email }, 'Email User: Start')

      const transporter = nodemailer.createTransport(this.mailerConfig)
      const emailTemplate = new EmailTemplate({
        transport: transporter,
        send: true,
        preview: false
      })

      const emailResp = await emailTemplate.send({
        template: 'mars',
        message: {
          from: '"Thank You Gift" <support@thankyougift.io>',
          to: email,
        },
        locals: {
          name: 'Elon'
        },
      })

      this.log.info({ emailResp }, 'Email User: Success')

      return 'success'
    } catch (err) {
      this.log.error({ err }, 'Email User: Fail')
      throw err
    }
  }
}
