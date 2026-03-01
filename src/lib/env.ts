import { z } from "zod";

const envSchema = z.object({
  API_URL: z.url({ protocol: /^https?$/ }),
  AUTH_TOKEN: z.string().min(1),
});

function validateEnv() {
  const parsed = envSchema.safeParse({
    API_URL: process.env.API_URL,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
  });

  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.message}`);
  }

  return parsed.data;
}

export const env = validateEnv();
