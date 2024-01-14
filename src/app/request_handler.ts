import { ApplicationConfig, RequestAction } from "../types.js";
import express from "express";
import * as bodyParser from "body-parser";
import { eventContext } from "aws-serverless-express/middleware";

export interface RequestEvent<Payload = any> {
  action: RequestAction;
  payload: Payload;
}

export interface APIResponse {
  statusCode: number;
  body: any;
}

export default class APIRequestHandler {
  private readonly config: ApplicationConfig;

  constructor(config: ApplicationConfig) {
    this.config = config;
  }

  public async eventHandler(event: any): Promise<APIResponse> {
    const { action, payload } = event;
    switch (action) {
      case RequestAction.GetSystemPrompt:
        const prompt = await this.config.promptBuilder.getSystemPrompt();
        return {
          statusCode: 200,
          body: {
            prompt,
          },
        };
      case RequestAction.GetPrompt:
        const query = payload.query;
        const promptForQuery =
          await this.config.promptBuilder.getPromptForQuery(query);
        return {
          statusCode: 200,
          body: {
            prompt: promptForQuery,
          },
        };
      case RequestAction.Query:
        return {
          statusCode: 200,
          body: {
            message: "hello world",
          },
        };
      default:
        return {
          statusCode: 400,
          body: {
            message: "Invalid action",
          },
        };
    }
  }

  public getExpressApp(): express.Application {
    const app = express();
    app.use(bodyParser.json());
    app.use(eventContext());

    // Enable CORS for all methods
    app.use(function (_: unknown, res: any, next: any) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
      next();
    });

    app.route("/").post(async (req: any, res: any) => {
      const response = await this.eventHandler({
        action: req.body.action,
        payload: req.body,
      });
      res.status(response.statusCode).json(response.body);
    });

    return app;
  }
}
