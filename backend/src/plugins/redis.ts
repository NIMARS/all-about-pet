import fp from 'fastify-plugin'
import { Redis } from 'ioredis'
import { env } from '../utils/env'

export default fp(async (app) => {
  if (!env.REDIS_URL || env.REDIS_URL === 'off') {
    app.log.warn('Redis disabled (REDIS_URL=off). Using in-memory fallbacks.')
    return
  }
  try {
    const redis = new Redis(env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 0 })
    await redis.connect()
    app.decorate('redis', redis)
    app.addHook('onClose', async () => { try { await redis.quit() } catch {} })
    redis.on('error', (e) => app.log.warn({ err: e }, 'Redis error'))
  } catch (e) {
    app.log.warn({ err: e }, 'Redis unavailable. Using in-memory fallbacks.')
  }
})

declare module 'fastify' {
  interface FastifyInstance {
    redis: import('ioredis').Redis
  }
}
