import jwt from 'jsonwebtoken'
import { isNil } from 'ramda'

export const validateToken = ({ jwtSecret, header }) => {
  try {
    const { authorization } = header

    if (isNil(authorization)) {
      throw new Error('Authorization token missing from header.')
    }
    const token = auth.split('Bearer ')
    console.log('token', authorization)

    const decoded = jwt.verify(token, jwtSecret)
    const { email } = decoded
    return { email }
  } catch (err) {
    console.log('err: ', err)
    throw new Error(err)
  }
}

export const signToken = ({ jwtSecret, email }) => {
  try {
    const token = jwt.sign({ email }, jwtSecret, {
      subject: email,
      expiresIn: '2m'
    })

    return token
  } catch (err) {
    console.log('err: ', err)
    throw new Error(err)
  }
}

export const getTokenExpiry = ({ jwtSecret, token }) => {
  try {
    const decoded = jwt.verify(token, jwtSecret)
    const expiry = decoded
    console.log('expiry: ', expiry)
    return expiry
  } catch (err) {
    console.log('err: ', err)
    throw new Error(err)
  }
}
