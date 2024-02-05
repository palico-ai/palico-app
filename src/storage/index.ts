import { type ChatCompletionTool } from 'openai/resources'
import { type OpenAIMessage } from '../model/types'

export interface CreateConversationParams {
  tools: ChatCompletionTool[]
  history: OpenAIMessage[]
}

export interface ConversationModel {
  id: number
  history: OpenAIMessage[]
  tools: ChatCompletionTool[]
  createdAt: string
  updatedAt: string
}

export type UpdatableConversationModel = Omit<Partial<ConversationModel>, | 'createdAt' | 'updatedAt'>

export interface ConversationService {
  create: (params: CreateConversationParams) => Promise<ConversationModel>
  findById: (id: number) => Promise<ConversationModel | undefined>
  update: (conversation: Partial<UpdatableConversationModel>) => Promise<void>
}

export interface StorageService {
  conversation: ConversationService
}
