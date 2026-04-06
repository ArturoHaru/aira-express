import axios from "axios";
import { env } from "../env.js";

export const checkService = async (audio: Express.Multer.File) => {
  // Se sai che c'è un redirect, è meglio usare direttamente https://
  const endpoint = env.OPENWAKEWORD_ENDPOINT;

  // 1. Costruisci il FormData correttamente
  const formData = new FormData();
  const fileBlob = new Blob([new Uint8Array(audio.buffer)], {
    type: audio.mimetype,
  });
  formData.append("audio", fileBlob, audio.originalname);

  const response = await axios.post(endpoint, formData);

  return response.data;
};
