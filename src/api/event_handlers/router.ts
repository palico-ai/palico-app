import { type Application } from '../../app'
import NewConversationEventHandler from './new_conversation'
import ReplyAsToolEventHandler from './reply_as_tool'
import ReplyAsUserEventHandler from './reply_as_user'
import { type Event, EventAction, type EventHandler } from './types'

interface EventHandlerParams {
  application: Application
}

export class EventRouter {
  private readonly application: Application
  private static readonly eventHandlerMap: Record<EventAction, EventHandler<any, any>> = {
    [EventAction.NewConversation]: NewConversationEventHandler,
    [EventAction.ReplyAsUser]: ReplyAsUserEventHandler,
    [EventAction.ReplyAsTool]: ReplyAsToolEventHandler
  }

  constructor (params: EventHandlerParams) {
    this.application = params.application
  }

  public async handle (event: Event): Promise<any> {
    const { action, payload } = event
    if (!action) throw new Error('No action provided')
    if (!Object.keys(EventRouter.eventHandlerMap).includes(action as string)) {
      throw new Error(`Invalid action ${action}`)
    }
    const handler = EventRouter.eventHandlerMap[action as EventAction]
    if (!handler) {
      throw new Error(`Invalid action ${action}`)
    }
    const response = await handler(payload, {
      application: this.application
    })
    return response
  }
}
