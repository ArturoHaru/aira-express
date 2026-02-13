import { NextFunction, Request, Response } from "express";
import { lms } from "../services/lm-studio";
import OpenAI from "openai";
import {
  getAudioSynthesisService,
  getTranscriptionService,
} from "../services/speaches.service";

const client = new OpenAI({
  baseURL: "http://lily.home:8000/v1",
  apiKey: "noneed",
});

export const addInteraction = async (req: Request, res: Response) => {
  //1 genera trascrizione
  const audio = req.file as Express.Multer.File;

  if (!audio) {
    res.status(400).send("Audio mancante");
    console.error("Nessun audio caricato");
    return;
  }
  const transcriptionPromise = getTranscriptionService(audio);
  transcriptionPromise.then(() => {
    console.log("Trascrizione completata:");
  });
  const transcription = await transcriptionPromise;
  console.log(transcription);
  if (!transcription) {
    res.status(500).send("Errore di trascrizione");
    return;
  }

  //Opzionale: fa controllare la trascrizione da un agente

  //2 Controllo del flow della trascrizione:
  // se il prompt è stato mandato quando un oggetto di contesto è attivo, controlla chi è stato l'ultimo attore della conversazione.
  // Se era l'assistente, appendi il prompt normalmente all'oggetto
  // Se era l'utente CONCATENA il nuovo prompt al vecchio

  const system_prompt =
    "Sei un assistente digitale. Mantieni le risposte conversazionali e riduci al MINIMO le parole";
  const history = [
    {
      role: "system" as "user" | "assistant" | "system" | undefined,
      content: system_prompt,
    },
    {
      role: "user" as "user" | "assistant" | "system" | undefined,
      content: transcription,
    },
  ];

  //3 manda trascrizione ad llm
  const llmAnswer = await lms.getAnswer(history);
  console.log(`Answer: ${llmAnswer.content}`);
  //4 Genera audio da trascrizione
  // TODO prova a farlo in streaming
  const llmAudio = await getAudioSynthesisService(llmAnswer.content);
  res.setHeader("Content-Type", "audio/mpeg");
  res.send(llmAudio);
};
