import Stripe from 'stripe'

export class TransactionService {
  constructor({ apiKey, log }) {
    this.stripe = Stripe(apiKey)
    this.log = log.child({
      service: 'transaction'
    })
  }

  async charge({ amount, token }) {
    try {
      this.log.info({ amount }, 'Create Transaction: Start')

      const { status } = await this.stripe.charges.create({
        amount: amount * 100,
        currency: 'usd',
        description: 'Photo Purchase',
        source: token
      })

      this.log.info({ amount }, 'Create Transaction: Success')

      return status
    } catch (err) {
      this.log.error({ err }, 'Create Transaction: Fail')
      throw err
    }
  }
}
