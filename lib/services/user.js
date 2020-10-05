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
    saltRounds,
    jwtToken,
    genId,
    log
  }) {
    this.mongoService = mongoService
    this.stripeService = stripeService
    this.s3Service = s3Service
    this.emailAuth = emailAuth
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
        password: saltedPassword,
        firstName,
        lastName
      })

      const token = jsonwebtoken.sign({ email }, this.jwtToken, { expiresIn: '14d' })
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
        throw new Error(`No user Found with Email: ${email}`)
      }

      const isValid = await bcrypt.compare(password, user.password)

      if (!isValid) {
        throw new Error('Incorrect password')
      }

      const token = jsonwebtoken.sign({ email }, this.jwtToken, { expiresIn: '14d' })
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

      this.log.info({ email }, 'Get User By Email: Success')

      return user
    } catch(err) {
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
      const saltedPassword = await bcrypt.hash(tempPassword, this.saltRounds)


      const userResp = await this.mongoService.updateOne({
        query: { email },
        update: { $set: { password: saltedPassword } },
        collection: 'user'
      })

      this.log.info({ email }, 'Reset Password: Success')

      console.log('EMAIL : ' , email);
      const emailResp = await this.email({ email, password: tempPassword })
      return emailResp
    } catch(err) {
      this.log.error({ err }, 'Reset Password: Fail')
      throw err
    }
  }

  async saveUser ({
    email,
    password,
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
    } catch(err) {
      this.log.error({ err }, 'Update User: Fail')
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

  async email ({ email, password, amount }) {
    try {
      this.log.info({ email }, 'Email User: Start')

      console.log('email: ', email)
      console.log('password: ', password)

      const mailerConfig = {
        host: "smtp.office365.com",
        secure: true,
        port: 587,
        auth: this.email
      }

      const transporter = nodemailer.createTransport(mailerConfig)
      // verify connection configuration
      // transporter.verify(function(error, success) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("Server is ready to take our messages");
      //   }
      // })
      const info = await transporter.sendMail({
        from: 'support@thankyougift.io',
        to: email,
        subject: 'Reset Password: Thank You Gift',
        text: password,
        html: `<h1>Temp Password</h1><p>${password}</p>`
      })

      this.log.info({ info }, 'Email User: Success')

      return 'success'
    } catch (err) {
      this.log.error({ err }, 'Email User: Fail')
      throw err
    }
  }
}
