import { z } from 'zod'

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  ACCESS_TTL: z.string().default('15m'),
  REFRESH_TTL: z.string().default('30d'),
  REDIS_URL: z.string().default('redis://localhost:6379'),

  S3_ENDPOINT: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS: z.string().optional(),
  S3_SECRET: z.string().optional(),
  S3_REGION: z.string().default('us-east-1').optional(),

  BASE_URL: z.string().url().default('http://localhost:5173')
})
export type Env = z.infer<typeof EnvSchema>

import 'dotenv/config' 
export const env: Env = EnvSchema.parse(process.env)
