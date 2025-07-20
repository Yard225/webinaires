import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
  PORT: z.string().optional().default('3000'),
});

export type EnvSchema = z.infer<typeof envSchema>;
