import Stripe from 'stripe'

export class StripeService {
  constructor({
    apiKey,
    log
  }) {
    this.stripe = Stripe(apiKey)
    this.log = log.child({
      service: 'stripe'
    })
  }

  async charge ({ amount, token }) {
    try {
      this.log.info({ amount }, 'Make Stripe Charge: Start')

      const { status } = await this.stripe.charges.create({
        amount: amount * 100,
        currency: 'usd',
        description: 'Photo Purchase',
        source: token,
      })

      this.log.info({ amount }, 'Make Stripe Charge: Success')

      return status
    } catch (err) {
      this.log.error({ err }, 'Make Stripe Charge: Fail')
      throw err
    }
  }
}
