import { type ApplicationConfig } from '../types.js'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { eventContext } from 'aws-serverless-express/middleware'
import { type AppResponse, RequestAction, type RequestHandler } from './types.js'
import { GetPromptRequestHandler, GetSystemPromptRequestHandler, GetToolSetRequestHandler } from './handlers/index.js'

export default class AppEventHandler {
  private static readonly eventHandlerMap: Record<RequestAction, RequestHandler<any, any>> = {
    [RequestAction.GetSystemPrompt]: GetSystemPromptRequestHandler,
    [RequestAction.GetPrompt]: GetPromptRequestHandler,
    [RequestAction.GetToolSet]: GetToolSetRequestHandler
  }

  private readonly config: ApplicationConfig

  constructor (config: ApplicationConfig) {
    this.config = config
  }

  public async handle (event: any): Promise<AppResponse> {
    const { action, payload } = event
    if (!action) throw new Error('No action provided')
    if (!Object.keys(AppEventHandler.eventHandlerMap).includes(action as string)) {
      throw new Error(`Invalid action ${action}`)
    }
    const handler = AppEventHandler.eventHandlerMap[action as RequestAction]
    if (!handler) {
      throw new Error(`Invalid action ${action}`)
    }
    const response = await handler(payload, this.config)
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
      const response = await this.handle({
        action: req.body.action,
        payload: req.body
      })
      res.status(response.statusCode).json(response.body)
    })

    return app
  }
}
