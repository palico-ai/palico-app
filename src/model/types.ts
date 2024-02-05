import type OpenAI from 'openai'

export type OpenAIMessage = OpenAI.Chat.ChatCompletionMessageParam & {
  function_call?: OpenAI.Chat.ChatCompletionMessage['function_call']
}

export interface AgentMessage {
  role: OpenAI.Chat.ChatCompletionMessageParam['role']
  content: OpenAI.Chat.ChatCompletionMessageParam['content']
  toolCalls?: OpenAI.Chat.ChatCompletionMessage['tool_calls']
}

export interface AgentCallResponse {
  finishReason: OpenAI.Chat.ChatCompletion.Choice['finish_reason']
  message: AgentMessage
}
