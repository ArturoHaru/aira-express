import { Tool } from "@lmstudio/sdk";
import { weatherForecast } from "./weather-forecast-tool";
import { controlDevice } from "./control-devices";

export const tools: Tool[] = [weatherForecast, controlDevice];
