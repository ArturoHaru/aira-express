import express from "express";
import cors from "cors";
import { router as llmRouter } from "./routes/llm.route";

const app = express();
const port = 9000;

app.use(express.json());
app.use(cors());
app.use("/api", llmRouter);

app.get("/", (req, res) => {
  res.send("Mettere SPA quì");
});

app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});
