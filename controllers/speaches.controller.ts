import { Request, Response } from "express";
import {
  getTranscriptionService,
  getAudioSynthesisService,
} from "../services/speaches.service";

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
