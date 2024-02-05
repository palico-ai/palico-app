export enum EventName {
  NewConversation = 'new-conversation',
}

export interface EventParams<Payload = any> {
  type: EventName
  payload: Payload
}

export type EventListener<Payload> = (event: EventParams<Payload>) => Promise<void>

export class EventBridge {
  private readonly listeners: Record<EventName, Array<EventListener<any>>> = {
    [EventName.NewConversation]: []
  }

  public async on<Payload>(eventName: EventName, listener: EventListener<Payload>): Promise<void> {
    this.listeners[eventName].push(listener)
  }

  public async emit<Payload>(event: EventParams<Payload>): Promise<void> {
    const listeners = this.listeners[event.type]
    // TODO: Handle errors
    await Promise.all(listeners.map(async listener => { await listener(event) }))
  }
}
