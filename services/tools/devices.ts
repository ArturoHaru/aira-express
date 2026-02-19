import { z } from "zod";

export const ControlDeviceSchema = {
  entity_id: z
    .enum([
      "light.lampada",
      "switch.macchinetta_caffe_socket_1",
      "switch.forno_socket_1",
    ])
    .describe(
      "L'ID esatto del dispositivo. Usa light.lampada per la lampada, etc.",
    ),
  action: z
    .enum(["turn_on", "turn_off", "toggle"])
    .describe("L'azione da eseguire sul dispositivo"),
};
