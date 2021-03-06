import jwt from 'jsonwebtoken'
import { isNil } from 'ramda'

export const validateToken = ({ jwtSecret, header }) => {
  try {
    const { authorization } = header
    if (isNil(authorization)) {
      throw new Error('Authorization token missing from header.')
    }
    const token = authorization.split(' ')[1]

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
      expiresIn: '2w'
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
    return expiry
  } catch (err) {
    console.log('err: ', err)
    throw new Error(err)
  }
}
