import { string, z } from "zod";
import { ControlDeviceSchema } from "./devices";
import { env } from "../../env";
import { tool } from "@lmstudio/sdk";
import axios from "axios";

export const controlDevice = tool({
  name: "controlDevice",
  description: "Accende, spegne o inverte lo stato di luci e prese smart.",
  parameters: ControlDeviceSchema,
  implementation: async ({ entity_id, action }) => {
    try {
      // Estrae il dominio: 'light' o 'switch'
      const domain = entity_id.split(".")[0];

      const actionEndpoint = `${env.HOME_ASSISTANT_BASE_URL}/services/${domain}/${action}`;

      const response = await axios.post(
        actionEndpoint,
        { entity_id: entity_id },
        {
          headers: {
            Authorization: `Bearer ${env.HOME_ASSISTANT_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );

      return `Successo: ${entity_id} impostato su ${action}.`;
    } catch (error) {
      console.error("Errore API Controllo HA:", error);
      return {
        error: `Impossibile eseguire ${action} su ${entity_id}. Il server ha restituito un errore.`,
      };
    }
  },
});
