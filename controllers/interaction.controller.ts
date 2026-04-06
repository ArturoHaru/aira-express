import { Request, Response } from "express";
import { model } from "../services/lm-studio.js";
import { Context } from "../services/context/context.service.js";
import {
  getAudioSynthesisService,
  getTranscriptionService,
} from "../services/speaches.service.js";
import { tools } from "../services/tools/tools.js";

const context = new Context(
  "Sei un assistente digitale. Mantieni le risposte veloci e conversazionali. Parla correttamente in italiano.",
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
  context.insertUserMessage(transcription);

  //3 manda trascrizione ad llm

  await model.act(context.chat, tools, {
    onMessage: async (message) => {
      const role = message.getRole();

      if (role === "tool") return;
      else {
        //role === assistant
        if (context.lastMessage().getRole() === "assistant")
          context.replaceLastMessage(message.getText());
        else context.appendMessage("assistant", message.getText());
      }
    },
  });
  try {
    const lastMessageText = context.lastMessage().getText();
    const llmAudio = await getAudioSynthesisService(lastMessageText);

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(llmAudio);

    console.log("----------------HISTORY----------------");
    for (let msg of context.chat.getMessagesArray()) {
      console.log(`${msg.getRole()}: ${msg.getText()}`);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
