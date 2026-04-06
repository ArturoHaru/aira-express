import OpenAI from "openai";
import { toFile } from "openai/uploads.js";
import { env } from "../env.js";

const client = new OpenAI({
  baseURL: env.SPEACHES_BASE_URL,
  apiKey: "noneed",
});

export const getTranscriptionService = async (audio: Express.Multer.File) => {
  const transcription = await client.audio.transcriptions.create({
    file: await toFile(audio.buffer, audio.originalname, {
      type: audio.mimetype,
    }),
    model: env.SPEACHES_TRANSCRIPTION_MODEL,
  });

  if (!transcription) {
    console.error("Trascrizione non riuscita");
    return null;
  }
  return transcription.text;
};

export const getAudioSynthesisService = async (text: string) => {
  const mp3 = await client.audio.speech.create({
    model: env.SPEACHES_SYNTHESIS_MODEL,
    voice: env.SPEACHES_SYNTHESIS_VOICE,
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  return buffer;
};
