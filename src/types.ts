import { JSONSchema6 } from "json-schema";
import { OpenAI } from "openai";

export interface IncludeStatement {
  files: string[];
  directories: string[];
}

export interface PackageConfig {
  app: {
    entryPath: string;
    build: string[];
  };
  include: IncludeStatement;
}

export type Message = OpenAI.Chat.ChatCompletionMessageParam;

export enum ToolExecutionEnvironment {
  Client = "client",
  Local = "local",
}

interface IToolSchema {
  name: string;
  description: string;
  input?: JSONSchema6;
  output?: JSONSchema6;
  executionEnvironment: ToolExecutionEnvironment;
}

interface ClientToolSchema extends IToolSchema {
  executionEnvironment: ToolExecutionEnvironment.Client;
}

interface LocalToolSchema extends IToolSchema {
  executionEnvironment: ToolExecutionEnvironment.Local;
  handler: (input: any) => Promise<any>;
}

export type ITool = ClientToolSchema | LocalToolSchema;

export interface Toolset {
  name: string;
  tools: ITool[];
}

export interface PromptBuilder {
  getSystemPrompt(): Promise<string>;
  getPromptForQuery(query: string): Promise<string>;
}

export interface ProjectConfig {
  orgId: number;
  projectId: number;
  apiKey: string;
}

export interface ApplicationConfig {
  project: ProjectConfig;
  model: string;
  promptBuilder: PromptBuilder;
  toolset: Toolset;
}

export interface Application {
  readonly config: ApplicationConfig;

  query(query: string): Promise<Message>;

  getPromptForQuery(queryr: string): Promise<string>;

  getSystemPrompt(): Promise<string>;
}

export enum RequestAction {
  Query = "query",
  GetPrompt = "get_prompt",
  GetSystemPrompt = "get_system_prompt",
}

export interface RequestEvent<Payload = any> {
  action: RequestAction;
  payload: Payload;
}

export type RequestHandler = (event: RequestEvent) => Promise<any>;
