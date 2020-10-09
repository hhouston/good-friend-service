import jwt from 'jsonwebtoken'

export const validateToken = ({ jwtSecret, token }) => {
  try {
    console.log('jwtSecret: ', jwtSecret)
    console.log('token', token)
    const decoded = jwt.verify(token, jwtSecret)
    console.log('decoded: ', decoded)
    return decoded
  } catch (err) {
    console.log('err: ', err)
    throw new Error(err)
  }
}
