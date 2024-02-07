import { createExpressApp } from '../../api/express_app'
import { Application } from '../../app'
import { LocalStorage } from '../../storage/local_storage'
import { CurrentProject } from '../../utils/current_project'

export const ServeDevServer = async (): Promise<void> => {
  const appConfig = await CurrentProject.getApplicationAPIConfig(false)
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
  const api = createExpressApp(app)
  const PORT = process.env.PORT ?? 8002
  api.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
  })
}
