import { ExpressAPIBuilder } from '../../api'
import { Application } from '../../app'
import { LocalStorage } from '../../storage/local_storage'
import { sequelize } from '../../storage/local_storage/database'
import { CurrentProject } from '../../utils/current_project'

export const ServeDevServer = async (): Promise<void> => {
  const appConfig = await CurrentProject.getApplicationAPIConfig()
  const storage = new LocalStorage()
  await sequelize.sync({ force: false })
  const app = new Application({
    promptBuilder: appConfig.promptBuilder,
    tools: appConfig.toolset?.tools ?? [],
    model: {
      model: appConfig.model,
      openaiApiKey: appConfig.openaiApiKey
    },
    storage
  })
  const api = new ExpressAPIBuilder({ application: app })
  const PORT = process.env.PORT ?? 8002
  api.build().listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
  })
}
