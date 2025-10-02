import crypto from 'crypto'
export const sha256hex = (buf: Buffer | string) => crypto.createHash('sha256').update(buf).digest('hex')
