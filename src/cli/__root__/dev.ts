import Application from '../../application'
import { LocalStorage } from '../../storage/local_storage'
import CurrentProject from '../../utils/current_project'

export const ServeDevServer = async (): Promise<void> => {
  const appConfig = await CurrentProject.getApplicationConfig(false)
  const storage = new LocalStorage()
  const app = new Application({
    promptBuilder: appConfig.promptBuilder,
    tools: appConfig.toolset?.tools ?? [],
    model: {
      model: appConfig.model,
      openaiApiKey: appConfig.openaiApiKey
    },
    storage
  })
  // TODO: Take port as an argument or from config
  const port = 8002
  app.requestHandler.getExpressApp().listen(port, () => {
    console.log(`Server started on port ${port}`)
  })
}
