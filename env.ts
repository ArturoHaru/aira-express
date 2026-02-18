import { z } from "zod";

const envSchema = z.object({
  LLM_WEBSOCKET: z.string().url().default("ws://localhost:1234"),
  LLM_MODEL: z.string().min(1),
  OPENWAKEWORD_ENDPOINT: z.string().url().min(1),
  SPEACHES_BASE_URL: z.string().url().default("http://localhost:8000/v1"),
  SPEACHES_TRANSCRIPTION_MODEL: z.string().min(1),
  SPEACHES_SYNTHESIS_MODEL: z.string().min(1),
  SPEACHES_SYNTHESIS_VOICE: z.string().min(1),
});

export const env = envSchema.parse(process.env);
