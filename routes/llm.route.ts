import { Router } from "express";
import { getLLMResponse } from "../controllers/llm.controller";

export const router = Router();

router.post("/lmstudio/answer", getLLMResponse);
