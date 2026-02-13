import { Router } from "express";
import multer from "multer";
import { addInteraction } from "../controllers/interaction.controller";

const upload = multer({ storage: multer.memoryStorage() });
export const router = Router();

router.post("/interaction", upload.single("file"), addInteraction);
