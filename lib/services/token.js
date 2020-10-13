import jwt from 'jsonwebtoken'

export const validateToken = ({ jwtSecret, token }) => {
  try {
    console.log('jwtSecret: ', jwtSecret)
    const { authorization } = token
    console.log('token', authorization)
    const decoded = jwt.verify(authorization, jwtSecret)
    const { email } = decoded
    return { email }
  } catch (err) {
    console.log('err: ', err)
    throw new Error(err)
  }
}
