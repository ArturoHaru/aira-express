import OpenAI from "openai";
import { toFile } from "openai/uploads.js";

const client = new OpenAI({
  baseURL: "http://lily.home:8000/v1",
  apiKey: "noneed",
});

export const getTranscriptionService = async (audio: Express.Multer.File) => {
  const transcription = await client.audio.transcriptions.create({
    file: await toFile(audio.buffer, audio.originalname, {
      type: audio.mimetype,
    }),
    model: "kp-forks/faster-whisper-small",
  });

  if (!transcription) {
    console.error("Trascrizione non riuscita");
    return null;
  }
  return transcription.text;
};

export const getAudioSynthesisService = async (text: string) => {
  const mp3 = await client.audio.speech.create({
    model: "speaches-ai/piper-it_IT-paola-medium",
    voice: "paola",
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  return buffer;
};
