import { Request, Response } from "express";
import { checkService } from "../services/openwakeword.service.js";

export const check = async (req: Request, res: Response) => {
  const audio = req.file as Express.Multer.File;
  if (!audio) {
    res.status(500).send("Nessun audio ricevuto");
    return;
  }

  const wakeword_detected = await checkService(audio);
  res.send(wakeword_detected);
};
