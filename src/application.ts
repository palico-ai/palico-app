import { type ModelConfig, type PromptBuilder, type Tool } from './user_app'
import { type StorageService } from './storage'
import { EventBridge } from './event_bridge'
import RequestHandler from './api/request_handler'

interface ApplicationAPIParams {
  storage: StorageService
  promptBuilder: PromptBuilder
  tools: Tool[]
  model: ModelConfig
}

class Application {
  public readonly promptBuilder: PromptBuilder
  public readonly tools: Tool[]
  public readonly storage: StorageService
  public readonly model: ModelConfig
  public readonly eventBridge: EventBridge
  public readonly requestHandler: RequestHandler

  constructor (params: ApplicationAPIParams) {
    this.promptBuilder = params.promptBuilder
    this.tools = params.tools
    this.model = params.model
    this.storage = params.storage
    this.eventBridge = new EventBridge()
    this.requestHandler = new RequestHandler(params)
  }
}

export default Application
