import { Router } from "express";
import { getLLMResponse } from "../controllers/llm.controller";

export const router = Router();

//chiamata rpc
router.post("/lmstudio/answer", getLLMResponse);
