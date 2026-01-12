import { Router } from "express";
import { getLLMResponse } from "../controllers/llm.controller";
import { getTranscription } from "../controllers/speaches.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const router = Router();

//chiamata rpc
router.post("/lmstudio/answer", getLLMResponse);
router.post("/speaches/tanscribe", upload.single("file"), getTranscription);
