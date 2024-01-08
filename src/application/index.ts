import { ApplicationConfig } from "../types"

enum ActionName {
  GetSystemPrompt = "get_system_prompt",
  GetPromptForQuery = "get_prompt_for_query",
}

type Event = {
  action: ActionName
  payload: any
}

export default class Application {
  public readonly config: ApplicationConfig

  constructor(config: ApplicationConfig) {
    this.config = config
  }

  getSystemPrompt() : string {
    return this.config.promptBuilder.getSystemPrompt()
  }

  getPromptForQuery(query: string) : string {
    return this.config.promptBuilder.getPromptForQuery(query)
  }

  public async lambda(event: Event) : Promise<any> {
    switch (event.action) {
      case ActionName.GetSystemPrompt:
        return this.getSystemPrompt()
      case ActionName.GetPromptForQuery:
        return this.getPromptForQuery(event.payload.query)
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({
              message: 'hello world',
          }),
      };
    }
  }
}