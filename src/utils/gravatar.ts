import crypto from 'crypto'

export const generateUrl = (email: string): string => {
  const trimmedEmail = email.trim().toLowerCase()
  const hash = crypto.createHash('sha256').update(trimmedEmail).digest('hex')
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`
}

export default {
  generateUrl
}
