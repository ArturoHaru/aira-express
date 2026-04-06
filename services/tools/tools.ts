import { Tool } from "@lmstudio/sdk";
import { weatherForecast } from "./weather-forecast-tool.js";
import { controlDevice } from "./control-devices.js";

export const tools: Tool[] = [weatherForecast, controlDevice];
