import { type StorageService } from '../storage'
import { type Tool, type PromptBuilder, type ModelConfig } from '../user_app/types'

export enum RequestAction {
  NewConversation = 'new_conversation',
  ReplyAsUser = 'reply_as_user',
  ReplyAsTool = 'reply_as_tool'
}

export interface RequestEvent<Payload = any> {
  action: RequestAction
  payload: Payload
}

export interface APIResponse<Body = any> {
  statusCode: 200 | 400 | 500
  body: Body
}

export interface APIRequestHandlerParams {
  promptBuilder: PromptBuilder
  tools: Tool[]
  storage: StorageService
  model: ModelConfig
}

export type APIRequestHandler<Payload, Body> = (
  payload: Payload,
  params: APIRequestHandlerParams
) => Promise<APIResponse<Body>>
