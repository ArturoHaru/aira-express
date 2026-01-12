import { NextFunction, Request, Response } from "express";
//import { speaches } from "../services/speaches";

import OpenAI from "openai";
import { toFile } from "openai/uploads.js";

export const getTranscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let audio = req.file as Express.Multer.File;
  if (!audio) {
    console.error("Nessun audio caricato");
    return;
  }

  // sposta in un altro file
  const client = new OpenAI({
    baseURL: "http://lily.home:8000/v1",
    apiKey: "noneed",
  });

  const transcription = await client.audio.transcriptions.create({
    file: await toFile(audio.buffer, audio.originalname, {
      type: audio.mimetype,
    }),
    model: "kp-forks/faster-whisper-small",
  });

  console.log(transcription);
  res.json(transcription);
};
