import type { FastifyInstance } from 'fastify'

const mem = new Map<string, { tokens: number; ts: number; exp: number }>();


export async function tokenBucket(app: FastifyInstance, key: string, capacity = 60, refillPerSec = 1) {
  const now = Math.floor(Date.now() / 1000)


  if (!app.redis || (app.redis as any).status !== 'ready') { //without redis
    const st = mem.get(key) ?? { tokens: capacity, ts: now, exp: now+120 };
    const tokens = Math.min(capacity, st.tokens + (now - st.ts)*refillPerSec);
    if (tokens < 1) return false;
    mem.set(key, { tokens: tokens - 1, ts: now, exp: now+120 });
    for (const [k,v] of mem) if (v.exp < now) mem.delete(k);
    return true;
  }

  const stateKey = `tb:${key}` //with redis
  const state = await app.redis.hgetall(stateKey)
  const lastTs = state.ts ? Number(state.ts) : now
  const tokens = Math.min(
    capacity,
    (state.tokens ? Number(state.tokens) : capacity) + (now - lastTs) * refillPerSec
  )
  if (tokens < 1) return false
  await app.redis.hset(stateKey, { tokens: tokens - 1, ts: now })
  await app.redis.expire(stateKey, Math.max(60, Math.ceil(capacity / refillPerSec)))
  return true
}
