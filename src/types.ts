import { JSONSchema6 } from "json-schema";
import { OpenAI } from "openai";

export interface PalicoIncludeConfig {
  files: string[];
  directories: string[];
}

export interface PalicoConfig {
  app: string,
  include: PalicoIncludeConfig;
  scripts: {
    bundle: string[]
  }
}

export type Message = OpenAI.Chat.ChatCompletionMessageParam;

export enum ToolExecutionEnvironment {
  Client = 'client',
  // API = 'backend'
}

export interface ITool {
  name: string;
  description: string;
  input?: JSONSchema6
  output?: JSONSchema6
  executionEnvironment: ToolExecutionEnvironment
}

export interface Toolset {
  name: string
  tools: ITool[]
}

export interface PromptBuilder {
  getSystemPrompt() : string
  getPromptForQuery(query: string) : string
}

export type FunctionPath = {
  entryPoint: string
}

export interface Evaluator {
  evaluate(): Promise<void>
}


export interface ProjectConfig {
  orgId: number;
  projectId: number;
  apiKey: string;
}

export interface ApplicationConfig {
  project: ProjectConfig
  model?: string
  promptBuilder: PromptBuilder
  toolsets: Toolset[]
  evaluator: Evaluator
  eventListener?: {
    onTokenUsage?: FunctionPath
    onAgentRequest?: FunctionPath
  }
}

export interface Evaluator {
  evaluate(): Promise<void>
}

// export interface Application {
//   config: ApplicationConfig

//   run() : Promise<void>

//   datasetBuilder(): Promise<void>

//   evaluate() : Promise<void>

//   finetune() : Promise<void>
// }