import { type ZodSchema } from 'zod'

export interface IncludeStatement {
  files: string[]
  directories: string[]
}

export interface PackageConfig {
  app: {
    entryPath: string
    build: string[]
  }
  include: IncludeStatement
}

export enum ToolExecutionEnvironment {
  Client = 'client',
  Local = 'local',
}

interface IToolSchema<InputSchema = any, OutputSchema = any> {
  name: string
  description: string
  input?: ZodSchema<InputSchema>
  output?: ZodSchema<OutputSchema>
  executionEnvironment: ToolExecutionEnvironment
}
interface ClientToolSchema extends IToolSchema {
  executionEnvironment: ToolExecutionEnvironment.Client
}

interface LocalToolSchema extends IToolSchema {
  executionEnvironment: ToolExecutionEnvironment.Local
  handler: (input: any) => Promise<any>
}

export type ITool = ClientToolSchema | LocalToolSchema

export interface Toolset {
  name: string
  tools: ITool[]
}

export interface PromptBuilder {
  getSystemPrompt: () => Promise<string>
  getPromptForQuery: (query: string) => Promise<string>
}

export interface ProjectConfig {
  orgId: number
  projectId: number
  apiKey: string
}

export interface ApplicationConfig {
  project: ProjectConfig
  model: string
  promptBuilder: PromptBuilder
  toolset: Toolset
}
