import AgentIterator, { type AgentIteratorResponse } from '../../model/agent'
import { type ToolExecutionMessage } from '../../model/llm/openai'
import { type APIRequestHandler } from '../types'

export interface ReplyAsToolParams {
  conversationId: number
  toolOutputs: ToolExecutionMessage[]
}

const ReplyAsToolEventHandler: APIRequestHandler<ReplyAsToolParams, AgentIteratorResponse> = async (payload, params) => {
  const { conversationId, toolOutputs } = payload
  if (!conversationId) {
    throw new Error('conversationId is required')
  }
  if (!toolOutputs) {
    throw new Error('tooloutputs are required')
  }
  const {
    promptBuilder, tools, model,
    storage: { conversation }
  } = params
  const agent = new AgentIterator({
    conversationId,
    promptBuilder,
    tools: tools ?? [],
    modelConfig: model,
    conversationService: conversation
  })
  const response = await agent.replyWithToolOutputs({
    toolOutputs
  })
  return {
    statusCode: 200,
    body: response
  }
}

export default ReplyAsToolEventHandler
