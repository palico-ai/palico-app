import { type MessageContext } from '../../user_app/types'
import AgentIterator, { type AgentIteratorResponse } from '../../model/agent'
import { type APIRequestHandler } from '../types'

export interface ReplyAsUserParams {
  conversationId: number
  message: string
  context: MessageContext
}

const ReplyAsUserEventHandler: APIRequestHandler<
ReplyAsUserParams,
AgentIteratorResponse
> = async (payload, params) => {
  const { conversationId, context, message } = payload
  if (!conversationId) {
    throw new Error('conversationId is required')
  }
  if (!message) {
    throw new Error('message is required')
  }
  const {
    promptBuilder,
    tools,
    model,
    storage: { conversation }
  } = params
  const agent = new AgentIterator({
    conversationId,
    promptBuilder,
    tools: tools ?? [],
    modelConfig: model,
    conversationService: conversation
  })
  const response = await agent.replyAsUser({
    message,
    context
  })
  return {
    statusCode: 200,
    body: response
  }
}

export default ReplyAsUserEventHandler
