import { type MessageContext } from '../../app_builder/types'
import { type AgentResponse } from '../../agent/stateful_agent'
import { type EventHandler } from './types'

export interface ReplyAsUserParams {
  conversationId: number
  message: string
  context: MessageContext
}

const ReplyAsUserEventHandler: EventHandler<
ReplyAsUserParams,
AgentResponse
> = async (payload, params) => {
  const { conversationId, context, message } = payload
  if (!conversationId) {
    throw new Error('conversationId is required')
  }
  if (!message) {
    throw new Error('message is required')
  }
  const {
    application
  } = params
  const response = await application.replyAsUser({
    message,
    context
  })
  return {
    statusCode: 200,
    body: response
  }
}

export default ReplyAsUserEventHandler
