import { type IStep, type RequestParams } from './types'

export class ProxyRequestStep implements IStep<RequestParams, RequestParams> {
  name: string = 'ProxyRequestStep'
  description: string = 'Proxy request to the agent API'

  public async run (params: RequestParams): Promise<any> {
    console.log('ProxyRequestStep.run', params)
    return params
  }
}
