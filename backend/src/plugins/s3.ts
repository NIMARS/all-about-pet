import fp from 'fastify-plugin'
import { S3Client } from '@aws-sdk/client-s3'
import { env } from '../utils/env'

export default fp(async (app) => {
  if (!env.S3_ENDPOINT || !env.S3_BUCKET || !env.S3_ACCESS || !env.S3_SECRET) {
    app.log.warn('S3 is not configured; uploads will be stored locally.')
    return
  }
  const s3 = new S3Client({
    region: env.S3_REGION || 'us-east-1',
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: true,
    credentials: { accessKeyId: env.S3_ACCESS!, secretAccessKey: env.S3_SECRET! }
  })
  app.decorate('s3', s3)
})

declare module 'fastify' {
  interface FastifyInstance {
    s3?: import('@aws-sdk/client-s3').S3Client
  }
}
