import axios from "axios";
import { ProjectConfig, PackageConfig } from "../../types.js";
import config from "../../config.js";
import CurrentProject from "../../utils/current_project.js";

export class ClientAPIService {
  static async instance(): Promise<ClientAPIService> {
    const config = await CurrentProject.getApplicationConfig();
    return new ClientAPIService(config.project);
  }

  private readonly config: ProjectConfig;

  constructor(config: ProjectConfig) {
    this.config = config;
  }

  private async getAuthHeader(): Promise<{
    "x-api-key": string;
  }> {
    return {
      "x-api-key": this.config.apiKey,
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
