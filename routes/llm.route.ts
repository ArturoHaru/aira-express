import { Router } from "express";
import { getLLMResponse } from "../controllers/llm.controller.js";

export const router = Router();

//chiamata rpc
router.post("/lmstudio/answer", getLLMResponse);
