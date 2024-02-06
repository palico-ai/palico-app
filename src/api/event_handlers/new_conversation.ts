import { type MessageContext } from '../../user_app/types'
import AgentIterator, { type AgentIteratorResponse } from '../../model/agent'
import { type APIRequestHandler } from '../types'

export interface NewConversationEventHandlerParams {
  message: string
  context: MessageContext
}

const NewConversationEventHandler: APIRequestHandler<
NewConversationEventHandlerParams,
AgentIteratorResponse
> = async (payload, params) => {
  console.log('NewConversationEventHandler', payload)
  const {
    promptBuilder, tools, model,
    storage: { conversation }
  } = params
  const agent = new AgentIterator({
    promptBuilder,
    tools: tools ?? [],
    modelConfig: model,
    conversationService: conversation
  })
  const response = await agent.replyAsUser({
    message: payload.message,
    context: payload.context
  })
  return {
    statusCode: 200,
    body: response
  }
}

export default NewConversationEventHandler
