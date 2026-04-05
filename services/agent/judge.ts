import { Context } from "../context/context.service";
import { model } from "../lm-studio";

export function rateInformation(info: string) {
  const SYSTEM_PROMPT =
    "Rispondi esclusivamente con un voto numerico da 1 a 10 in base a quanto il messaggio dell'utente è rilevante per la memoria a lungo termine di un assistente digitale.";
  const context = new Context(SYSTEM_PROMPT, async () => {});
  context.appendMessage("user", info);
  model.respond(context.chat);
}
