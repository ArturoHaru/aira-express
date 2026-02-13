import { Request, Response } from "express";

import OpenAI from "openai";
import { toFile } from "openai/uploads.js";

const client = new OpenAI({
  baseURL: "http://lily.home:8000/v1",
  apiKey: "noneed",
});

export const getTranscription = async (req: Request, res: Response) => {
  let audio = req.file as Express.Multer.File;

  if (!audio) {
    console.error("Nessun audio caricato");
    return;
  }

  const transcription = await client.audio.transcriptions.create({
    file: await toFile(audio.buffer, audio.originalname, {
      type: audio.mimetype,
    }),
    model: "kp-forks/faster-whisper-small",
  });

  console.log(transcription);
  res.json(transcription);
};

export const getAudioSynthesis = async (req: Request, res: Response) => {
  let llmAnswer = req.body.llmAnswer as string;

  const mp3 = await client.audio.speech.create({
    model: "speaches-ai/piper-it_IT-paola-medium",
    voice: "paola",
    input: llmAnswer,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  res.setHeader("Content-Type", "audio/mpeg");
  res.send(buffer);
};
