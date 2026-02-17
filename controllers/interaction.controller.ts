import { Request, Response } from "express";
import { lms, model } from "../services/lm-studio";
import { Context } from "../services/context/context.service";
import {
  getAudioSynthesisService,
  getTranscriptionService,
} from "../services/speaches.service";

const context = new Context(
  "Sei un assistente digitale. Mantieni le risposte veloci e conversazionali.",
  async () => {},
  2 * 60 * 1000, //2 minuti
);

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
  if (context.isActive()) {
    if (context.lastMessage().getRole() === "assistant") {
      // Se era l'assistente, appendi il prompt normalmente all'oggetto
      context.appendMessage("user", transcription);
    } else {
      // Se era l'utente concatena il nuovo prompt al vecchio
      const lastUserMessage = context.lastMessage();
      context.lastMessage().replaceText(`${lastUserMessage} ${transcription}`);
    }
  }

  //3 manda trascrizione ad llm
  await model.act(context.chat, [], {
    onMessage: async (message) => {
      console.log(`Answer: ${message}`);
      const llmAudio = await getAudioSynthesisService(message.getText());
      res.setHeader("Content-Type", "audio/mpeg");
      res.send(llmAudio);
    },
  });
};
