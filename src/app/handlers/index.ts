import { type ChatCompletionTool } from 'openai/resources/chat/completions'
import { type RequestHandler } from '../types'
import zodToJsonSchema from 'zod-to-json-schema'
import { type ModelConfig, type MessageContext } from '../../types'

// TODO: Add request validation

export interface GetSystemPromptResponseBody {
  prompt: string
}

export const GetSystemPromptRequestHandler: RequestHandler<
MessageContext,
GetSystemPromptResponseBody
> = async (payload, app) => {
  const prompt = await app.promptBuilder.getSystemPrompt({
    context: payload
  })
  return {
    statusCode: 200,
    body: {
      prompt
    }
  }
}

export interface GetPromptRequestBody {
  query: string
  context: Record<string, unknown>
}

export interface GetPromptResponseBody {
  prompt: string
}

export const GetPromptRequestHandler: RequestHandler<
GetPromptRequestBody,
GetPromptResponseBody
> = async (payload, app) => {
  const prompt = await app.promptBuilder.getPromptForQuery(payload.query, {
    context: payload.context
  })
  return {
    statusCode: 200,
    body: {
      prompt
    }
  }
}

export interface GetToolSetResponseBody {
  toolset: ChatCompletionTool[]
}

export const GetToolSetRequestHandler: RequestHandler<
unknown,
GetToolSetResponseBody
> = async (_, app) => {
  const toolset: ChatCompletionTool[] = app.toolset?.tools.map((tool) => {
    return {
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.input ? zodToJsonSchema(tool.input) : undefined
      }
    }
  }) ?? []
  return {
    statusCode: 200,
    body: {
      toolset
    }
  }
}

export interface ModelConfigResponse {
  model: string
  openaiApiKey: string
}

export const GetModelConfigHandler: RequestHandler<unknown, ModelConfig> = async (_, app) => {
  return {
    statusCode: 200,
    body: {
      model: app.model,
      openaiApiKey: app.openaiApiKey
    }
  }
}
