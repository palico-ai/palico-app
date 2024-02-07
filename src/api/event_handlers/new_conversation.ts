import { type MessageContext } from '../../app_builder/types'
import { type AgentResponse } from '../../agent/stateful_agent'
import { type EventHandler } from './types'

export interface NewConversationEventHandlerParams {
  message: string
  context: MessageContext
}

const NewConversationEventHandler: EventHandler<
NewConversationEventHandlerParams,
AgentResponse
> = async (payload, params) => {
  console.log('NewConversationEventHandler', payload)
  const {
    application
  } = params
  const response = await application.replyAsUser({
    message: payload.message,
    context: payload.context
  })
  return {
    statusCode: 200,
    body: response
  }
}

export default NewConversationEventHandler
