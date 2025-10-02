import type { FastifyInstance } from 'fastify'

const mem = new Map<string, number>() // jti -> expMs

export async function blacklistJti(app: FastifyInstance, jti: string, ttlSec: number) {
  if (app.redis && (app.redis as any).status === 'ready') {
    await app.redis.set(`bl:jti:${jti}`, '1', 'EX', ttlSec)
  } else {
    mem.set(jti, Date.now() + ttlSec*1000)
  }
}

export async function isBlacklisted(app: FastifyInstance, jti: string) {
  if (app.redis && (app.redis as any).status === 'ready') {
    return (await app.redis.exists(`bl:jti:${jti}`)) === 1
  }
  const exp = mem.get(jti)
  if (!exp) return false
  if (Date.now() > exp) { mem.delete(jti); return false }
  return true
}