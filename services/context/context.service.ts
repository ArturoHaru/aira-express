import { Chat, ChatMessage } from "@lmstudio/sdk";

// il contesto è un insieme di messaggi ordinati che vanno mandati all'llm per mantenere la conversazoine
// dopo due minuti il contesto viene analizzato da un agente Ippotalamo e poi svuotato
export class Context {
  /**
   *
   * @param onTimeout - Funzione da eseguire quando avviene il timeout
   */
  private timer: ReturnType<typeof setTimeout> | null = null;
  chat: Chat = Chat.empty();

  constructor(
    private systemPrompt: string,
    private onTimeoutEnd: (chat: Chat) => Promise<void>,
    private timoutSeconds: number = 5000,
  ) {
    this.chat.replaceSystemPrompt(systemPrompt);
  }

  appendMessage(role: "user" | "assistant", content: string) {
    this.chat.append(role, content);
    if (this.timer) clearTimeout(this.timer); //reset timemout
    this.timer = setTimeout(async () => {
      await this.onTimeoutEnd(this.chat); //analizza la chat
      this.chat = Chat.empty(); //reset chat
      this.chat.replaceSystemPrompt(this.systemPrompt);
    }, this.timoutSeconds);
  }

  lastMessage(): ChatMessage {
    return this.chat.at(-1);
  }

  isActive(): boolean {
    return this.chat.length !== 1;
  }
}
