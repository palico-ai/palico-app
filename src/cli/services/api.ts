import axios from "axios";
import { ProjectConfig } from "../../types";
import config from "../config";

export default class ClientAPIService {
  private readonly projectConfig: ProjectConfig;

  constructor(projectConfig: ProjectConfig) {
    this.projectConfig = projectConfig;
  }

  private async getAuthHeader(): Promise<{
    "x-api-key": string;
  }> {
    return {
      "x-api-key": this.projectConfig.apiKey,
    };
  }

  async get<Response = any>(path: string): Promise<Response> {
    console.log("ClientAPIService.get", config.ClientAPIURL, path);
    const fullPath = `${config.ClientAPIURL}/${path}`;
    const authHeader = await this.getAuthHeader();
    const response = await axios.get(fullPath, {
      headers: {
        ...authHeader,
      },
    });
    return response.data;
  }

  async post<Response = any>(path: string, body: any): Promise<Response> {
    const fullPath = `${config.ClientAPIURL}/${path}`;
    const authHeader = await this.getAuthHeader();
    const response = await axios.post(fullPath, body, {
      headers: {
        ...authHeader,
      },
    });
    return response.data;
  }

  async del<Response = any>(path: string): Promise<Response> {
    const fullPath = `${config.ClientAPIURL}/${path}`;
    const authHeader = await this.getAuthHeader();
    const response = await axios.delete(fullPath, {
      headers: {
        ...authHeader,
      },
    });
    return response.data;
  }
}
