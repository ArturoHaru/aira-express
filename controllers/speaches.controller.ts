import { Request, Response } from "express";
import {
  getTranscriptionService,
  getAudioSynthesisService,
} from "../services/speaches.service";

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

  const transcription = await getTranscriptionService(audio);
  res.json(transcription);
};

export const getAudioSynthesis = async (req: Request, res: Response) => {
  let llmAnswer = req.body.llmAnswer as string;

  const buffer = await getAudioSynthesisService(llmAnswer);
  res.setHeader("Content-Type", "audio/mpeg");
  res.send(buffer);
};
