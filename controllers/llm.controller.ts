//Rendi la scelta dell'llm dinamica
import { NextFunction, Request, Response } from "express";
import { lms } from "../services/lm-studio";

export const getLLMResponse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const prompt = req.body.prompt;
  const llmResponse = await lms.getAnswer(prompt);
  res.json(llmResponse);
};
