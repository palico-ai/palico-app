import { type AgentResponse } from '../../agent/stateful_agent'
import { type ToolExecutionMessage } from '../../llm/openai'
import { type EventHandler } from './types'

export interface ReplyAsToolParams {
  conversationId: number
  toolOutputs: ToolExecutionMessage[]
}

const ReplyAsToolEventHandler: EventHandler<ReplyAsToolParams, AgentResponse> = async (payload, params) => {
  const { conversationId, toolOutputs } = payload
  if (!conversationId) {
    throw new Error('conversationId is required')
  }
  if (!toolOutputs) {
    throw new Error('tooloutputs are required')
  }
  const response = await params.application.replyAsTool({
    conversationId,
    toolOutputs
  })
  return {
    statusCode: 200,
    body: response
  }
}

export default ReplyAsToolEventHandler
