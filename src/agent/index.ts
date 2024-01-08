import { PromptBuilder, Toolset } from "../types"

export interface AgentServiceParams {
  toolsets: Toolset[]
  promptBuilder: PromptBuilder
}

export default class AgentService {
  private readonly toolsets: Toolset[]
  private readonly promptBuilder: PromptBuilder

  constructor(params: AgentServiceParams) {
    this.toolsets = params.toolsets
    this.promptBuilder = params.promptBuilder
  }
}
