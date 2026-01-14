import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
// Assicurati che l'import del router sia corretto per ESM
import { router as llmRouter } from "./routes/llm.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 9000;

// Risoluzione corretta del percorso dist
const staticPathFromEnv = process.env.static || "dist/aira-angular/browser";
const absoluteStaticPath = path.join(__dirname, staticPathFromEnv);

app.use(express.json());
app.use(cors());

// --- 1. ORDINE DELLE ROTTE ---
// Le rotte API devono venire PRIMA della wildcard degli statici
app.use("/api", llmRouter);

// --- 2. SERVIRE I FILE STATICI ---
app.use(express.static(absoluteStaticPath));

// --- 3. FIX PATH ERROR & CALLBACK ---
// In Express 5, usa (.*) invece di * per catturare tutto.
// Nota l'ordine (req, res), tu avevi (res, req) invertiti!
app.get("*index", (req, res) => {
  res.sendFile(path.join(absoluteStaticPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});
