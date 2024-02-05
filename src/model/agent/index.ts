import { type AgentCallResponse } from '../types'
import OpenAIConversationThread, { type ToolExecutionMessage } from '../llm/openai'
import { TagLogger } from '../../utils/logger'
import { type ModelConfig, type Tool, type PromptBuilder } from '../../user_app/types'
import { type ChatCompletionTool } from 'openai/resources'
import zodToJsonSchema from 'zod-to-json-schema'
import { type ConversationService } from '../../storage'

export type AgentIteratorResponse = AgentCallResponse & {
  conversationId: number
}

interface ReplyAsUserParams {
  message: string
  context?: Record<string, unknown>
}

interface ReplyToolOptions {
  toolOutputs: ToolExecutionMessage[]
}

interface AgentIteratorParams {
  promptBuilder: PromptBuilder
  tools: Tool[]
  modelConfig: ModelConfig
  conversationService: ConversationService
  conversationId?: number
}

// const testTools = GetTrelloOpenAITools()

/**
 * Manages conversations, building prompts, running tools, resuming and pausing execution.
 */
export default class AgentIterator {
  private static readonly logger = new TagLogger(AgentIterator.name)
  readonly promptBuilder: PromptBuilder
  conversationId?: number
  readonly tools: ChatCompletionTool[]
  readonly modelConfig: ModelConfig
  private readonly conversationService: ConversationService

  // TODO: Add support for different models
  constructor (params: AgentIteratorParams) {
    this.conversationId = params.conversationId
    this.promptBuilder = params.promptBuilder
    this.tools = AgentIterator.getTools(params.tools)
    this.modelConfig = params.modelConfig
    this.conversationService = params.conversationService
  }

  private static getTools (tools: Tool[]): ChatCompletionTool[] {
    const toolset: ChatCompletionTool[] = tools.map((tool) => {
      return {
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.input ? zodToJsonSchema(tool.input) : undefined
        }
      }
    }) ?? []
    return toolset
  }

  private async startConversation (options: ReplyAsUserParams): Promise<AgentIteratorResponse> {
    const systemMessage = await this.promptBuilder.getSystemPrompt({
      context: options.context ?? {}
    })
    const userQuery = await this.promptBuilder.getPromptForQuery(options.message, {
      context: options.context ?? {}
    })
    const llm = new OpenAIConversationThread({
      // tools: testTools,
      tools: this.tools,
      model: this.modelConfig.model,
      openaiApiKey: this.modelConfig.openaiApiKey,
      history: [
        {
          role: 'system',
          content: systemMessage
        }
      ]
    })
    const response = await llm.sendUserMessage(userQuery)
    const conversation = await this.conversationService.create({
      tools: this.tools,
      history: llm.history
    })
    this.conversationId = conversation.id
    return {
      ...response,
      conversationId: conversation.id
    }
  }

  private async replyAsUserToConversation (params: ReplyAsUserParams): Promise<AgentIteratorResponse> {
    const { message, context } = params
    if (!this.conversationId) {
      throw new Error('Conversation ID not set')
    }
    const conversation = await this.conversationService.findById(this.conversationId)
    if (!conversation) {
      throw new Error('Conversation not found')
    }
    const prompt = await this.promptBuilder.getPromptForQuery(message, {
      context: context ?? {}
    })
    const llm = new OpenAIConversationThread({
      model: this.modelConfig.model,
      openaiApiKey: this.modelConfig.openaiApiKey,
      tools: this.tools,
      history: conversation.history
    })
    const response = await llm.sendUserMessage(prompt)
    await this.conversationService.update({
      ...conversation,
      history: llm.history
    })
    return {
      ...response,
      conversationId: this.conversationId
    }
  }

  async replyAsUser (params: ReplyAsUserParams): Promise<AgentIteratorResponse> {
    if (!this.conversationId) {
      return await this.startConversation(params)
    }
    return await this.replyAsUserToConversation(params)
  }

  async replyWithToolOutputs (params: ReplyToolOptions): Promise<AgentIteratorResponse> {
    AgentIterator.logger.log('replyWithToolOutputs')
    if (!this.conversationId) {
      throw new Error('Conversation ID not set. Cannot reply with tool outputs')
    }
    const { toolOutputs } = params
    const conversation = await this.conversationService.findById(this.conversationId)
    if (!conversation) {
      throw new Error('Conversation not found')
    }
    const llm = new OpenAIConversationThread({
      tools: this.tools,
      model: this.modelConfig.model,
      openaiApiKey: this.modelConfig.openaiApiKey,
      history: conversation.history
    })
    const response = await llm.sendToolExecutionOutputs(toolOutputs)
    await this.conversationService.update({
      ...conversation,
      history: llm.history
    })
    return {
      ...response,
      conversationId: this.conversationId
    }
  }
}
