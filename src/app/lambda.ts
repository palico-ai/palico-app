import { ApplicationConfig } from "../types";
import CurrentProject from "../utils/current_project";
import APIRequestHandler from "./request_handler";

export const handler = async (event: any): Promise<any> => {
  const appConfig : ApplicationConfig = await CurrentProject.getApplicationConfig(false);
  const app = new APIRequestHandler(appConfig);
  const response = await app.eventHandler(event);
  return response;
};
