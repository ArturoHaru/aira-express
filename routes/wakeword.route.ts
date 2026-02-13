import { Router } from "express";
import multer from "multer";
import { check } from "../controllers/wakeword.controller";

const upload = multer({ storage: multer.memoryStorage() });
export const router = Router();

router.post("/check_wakeword", upload.single("audio"), check);
