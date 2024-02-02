import { type ApplicationConfig } from '../types'

export enum RequestAction {
  GetPrompt = 'get_prompt',
  GetSystemPrompt = 'get_system_prompt',
  GetToolSet = 'get_toolset',
  GetModelConfig = 'get_model_config'
}

export interface RequestEvent<Payload = any> {
  action: RequestAction
  payload: Payload
}

export interface AppResponse<Body = any> {
  statusCode: 200 | 400 | 500
  body: Body
}

export type RequestHandler<Payload, Body> = (payload: Payload, appConfig: ApplicationConfig) => Promise<AppResponse<Body>>
