import {
  getAudioSynthesis,
  getTranscription,
} from "../controllers/speaches.controller";
import { Router } from "express";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
export const router = Router();
