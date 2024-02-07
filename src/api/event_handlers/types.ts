import { type Application } from '../../app'

export enum EventAction {
  NewConversation = 'new_conversation',
  ReplyAsUser = 'reply_as_user',
  ReplyAsTool = 'reply_as_tool'
}

export interface Event<Payload = any> {
  action: EventAction
  payload: Payload
}

export interface EventResponse<Body = any> {
  statusCode: 200 | 400 | 500
  body: Body
}

export interface EventHandlerParams {
  application: Application
}

export type EventHandler<Payload, Body> = (
  payload: Payload,
  params: EventHandlerParams
) => Promise<EventResponse<Body>>
