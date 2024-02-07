import { type ModelConfig, type PromptBuilder, type Tool } from '../app_builder'
import { type StorageService } from '../storage/types'
import { EventBridge } from '../event_bridge'
import { type ReplyAsUserParams, type AgentResponse, StatefulAgent } from '../agent/stateful_agent'
import { type ReplyAsToolParams } from '../api/event_handlers/reply_as_tool'

interface ApplicationAPIParams {
  storage: StorageService
  promptBuilder: PromptBuilder
  tools: Tool[]
  model: ModelConfig
}

interface ReplyAsToolRequest extends ReplyAsToolParams {
  conversationId: number
}

interface ReplyAsUserRequest extends ReplyAsUserParams {
  conversationId?: number
}

export class Application {
  public readonly promptBuilder: PromptBuilder
  public readonly tools: Tool[]
  public readonly storage: StorageService
  public readonly model: ModelConfig
  public readonly eventBridge: EventBridge

  constructor (params: ApplicationAPIParams) {
    this.promptBuilder = params.promptBuilder
    this.tools = params.tools
    this.model = params.model
    this.storage = params.storage
    this.eventBridge = new EventBridge()
  }

  public async replyAsUser (params: ReplyAsUserRequest): Promise<AgentResponse> {
    const agent = new StatefulAgent({
      promptBuilder: this.promptBuilder,
      tools: this.tools,
      modelConfig: this.model,
      conversationService: this.storage.conversation,
      conversationId: params.conversationId
    })
    const response = await agent.replyAsUser(params)
    return response
  }

  public async replyAsTool (params: ReplyAsToolRequest): Promise<AgentResponse> {
    const agent = new StatefulAgent({
      promptBuilder: this.promptBuilder,
      tools: this.tools,
      modelConfig: this.model,
      conversationService: this.storage.conversation,
      conversationId: params.conversationId
    })
    const response = await agent.replyWithToolOutputs({ toolOutputs: params.toolOutputs })
    return response
  }
}
