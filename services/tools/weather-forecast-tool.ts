import { tool } from "@lmstudio/sdk";
import axios from "axios";
import { env } from "../../env";
import { z } from "zod";

const baseAddress = env.HOME_ASSISTANT_BASE_URL;
const endpoint = `${baseAddress}/states/weather.forecast_home`;
const WeatherSchema = z
  .object({
    state: z.string(),
    attributes: z.object({
      temperature: z.number().min(1),
      temperature_unit: z.string().min(1),
    }),
  })
  .transform((data) => ({
    state: data.state,
    temperature: data.attributes.temperature.toPrecision(2),
    temperature_unit: data.attributes.temperature_unit,
  }));

export const weatherForecast = tool({
  name: "getWeather",
  description:
    "Restituisce le informazioni correnti sul meteo, come temperatura e cielo.",
  parameters: {},
  implementation: async () => {
    try {
      const weatherResponse = await axios.get(endpoint, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiYjE2ZWY3ZTBkOTE0N2RhYWI2MDY2MjY5NWRiMjI4ZCIsImlhdCI6MTc2ODY0MTQxOCwiZXhwIjoyMDg0MDAxNDE4fQ.WGfBnGX2QCKDr6vSgl8uVVeycB8YTT6YDbO6Nyq38uQ",
          "Content-Type": "application/json",
        },
      });

      console.log("-----WEATHER CALL------");
      const weatherResults = WeatherSchema.parse(weatherResponse.data);
      console.log(weatherResults);
      return `The weather is currently ${weatherResults.state} with a temperature of ${weatherResults.temperature}${weatherResults.temperature_unit}`;
    } catch (error) {
      console.error("Errore API Meteo:", error);

      // Restituisci un errore controllato in formato stringa o JSON all'LLM.
      // Questo previene il crash di Express gestendo internamente l'eccezione.
      return {
        error:
          "Impossibile recuperare il meteo. Il server ha restituito un errore.",
      };
    }
  },
});
