import type OpenAI from 'openai'
import { type MessageContext } from '../types'

export enum RequestType {
  NewConversation = 'new-conversation',
  ReplyAsUser = 'reply-as-user',
  ReplyToToolCall = 'reply-to-tool-call',
}

interface RequestBase<Payload> {
  type: RequestType
  payload: Payload
}

export interface NewConversationParams {
  deploymentId: number
  message: string
  context?: MessageContext
}

export interface NewConversationRequest extends RequestBase<NewConversationParams> {
  type: RequestType.NewConversation
}

export interface ReplyAsUserParams {
  deploymentId: number
  conversationId: number
  message: string
  context?: MessageContext
}

export interface ReplyAsUserRequest extends RequestBase<ReplyAsUserParams> {
  type: RequestType.ReplyAsUser
}

export interface ToolExecutionMessage {
  functionName: string
  toolId: string
  output: Record<string, unknown>
}

export interface ReplyToToolCallParams {
  deploymentId: number
  conversationId: number
  toolOutputs: ToolExecutionMessage[]
}

export interface ReplyToToolCallRequest extends RequestBase<ReplyToToolCallParams> {
  type: RequestType.ReplyToToolCall
}

export type RequestParams = NewConversationParams | ReplyAsUserParams | ReplyToToolCallParams

export interface AgentMessage {
  role: OpenAI.Chat.ChatCompletionMessageParam['role']
  content: OpenAI.Chat.ChatCompletionMessageParam['content']
  toolCalls?: OpenAI.Chat.ChatCompletionMessage['tool_calls']
}

export interface AgentCallResponse {
  finishReason: OpenAI.Chat.ChatCompletion.Choice['finish_reason']
  message: AgentMessage
  conversationId: number
}

export interface IStep<Input=any, Output=any> {
  name: string
  description: string
  run: (input: Input) => Promise<Output>
}
