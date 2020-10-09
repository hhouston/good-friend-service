import nanoid from 'nanoid/generate'
import { split, toUpper, map, join } from 'ramda'

export const createGenId = () => {
  const letters = split('', 'abcdefghijklmnopqrstuvwxyz')
  const upperLetters = map(toUpper, letters)
  const numbers = '0123456789'
  const alph = join('', [...letters, ...upperLetters, ...numbers])
  return () => nanoid(alph, 20)
}
