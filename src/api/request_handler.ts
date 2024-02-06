import { type Tool, type PromptBuilder, type ModelConfig } from '../user_app/types'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { eventContext } from 'aws-serverless-express/middleware'
import { type APIResponse, type APIRequestHandler, RequestAction } from './types'
import NewConversationEventHandler from './event_handlers/new_conversation'
import ReplyAsUserEventHandler from './event_handlers/reply_as_user'
import ReplyAsToolEventHandler from './event_handlers/reply_as_tool'
import { type StorageService } from '../storage'

interface APIRequestHandlerParams {
  promptBuilder: PromptBuilder
  tools: Tool[]
  storage: StorageService
  model: ModelConfig
}

export default class RequestHandler {
  private static readonly eventHandlerMap: Record<RequestAction, APIRequestHandler<any, any>> = {
    [RequestAction.NewConversation]: NewConversationEventHandler,
    [RequestAction.ReplyAsUser]: ReplyAsUserEventHandler,
    [RequestAction.ReplyAsTool]: ReplyAsToolEventHandler
  }

  private readonly tools: Tool[]
  private readonly promptBuilder: PromptBuilder
  private readonly storage: StorageService
  private readonly model: ModelConfig

  constructor (params: APIRequestHandlerParams) {
    this.tools = params.tools
    this.promptBuilder = params.promptBuilder
    this.storage = params.storage
    this.model = params.model
  }

  public async handleEvent (event: any): Promise<APIResponse> {
    const { action, payload } = event
    if (!action) throw new Error('No action provided')
    console.log('Handling action', action, payload)
    if (!Object.keys(RequestHandler.eventHandlerMap).includes(action as string)) {
      throw new Error(`Invalid action ${action}`)
    }
    const handler = RequestHandler.eventHandlerMap[action as RequestAction]
    if (!handler) {
      throw new Error(`Invalid action ${action}`)
    }
    const response = await handler(payload, {
      promptBuilder: this.promptBuilder,
      tools: this.tools,
      storage: this.storage,
      model: this.model
    })
    return response
  }

  public getExpressApp (): express.Application {
    const app = express()
    app.use(bodyParser.json())
    app.use(eventContext())

    // Enable CORS for all methods
    app.use(function (_: unknown, res: any, next: any) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', '*')
      next()
    })

    app.route('/').post(async (req: any, res: any) => {
      try {
        const response = await this.handleEvent({
          action: req.body.action,
          payload: req.body.payload
        })
        res.status(response.statusCode).json(response.body)
      } catch (error) {
        console.error('Error in request', error)
        if (error instanceof Error) {
          console.error(error.message)
          res.status(500).json({ error: error.message })
        } else {
          res.status(500).json({ error: 'An unknown error occurred' })
        }
      }
    })

    return app
  }
}
