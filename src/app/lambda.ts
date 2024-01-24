import { ApplicationConfig } from "../types";
import CurrentProject from "../utils/current_project";
import EventHandler from "./request_handler";

export const handler = async (event: any): Promise<any> => {
  const appConfig : ApplicationConfig = await CurrentProject.getApplicationConfig(false);
  const app = new EventHandler(appConfig);
  const response = await app.handle(event);
  return response;
};
