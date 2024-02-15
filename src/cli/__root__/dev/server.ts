import * as chalk from 'chalk'
import { defaultRequestAuthorizer } from '../../../api/middlewares/local_authorizer'
import { Application } from '../../../app'
import { LocalStorage } from '../../../storage/local_storage'
import { sequelize } from '../../../storage/local_storage/database'
import { CurrentProject } from '../../../utils/current_project'
import { ExpressAPIBuilder } from '../../../api/express_api_builder'
import { getServiceKey } from '../../../utils/jwt'

// Compiles the application with specific build command and starts the server
export const StartDevServer = async (): Promise<void> => {
  const appConfig = await CurrentProject.getApplicationAPIConfig()
  const storage = new LocalStorage()
  const FORCE_SYNC = process.env.FORCE_SYNC_DB === 'true'
  await sequelize.sync({ force: FORCE_SYNC })
  const app = new Application({
    promptBuilder: appConfig.promptBuilder,
    tools: appConfig.toolset?.tools ?? [],
    model: {
      model: appConfig.model,
      openaiApiKey: appConfig.openaiApiKey
    },
    storage
  })
  const serviceKey = await getServiceKey()
  const api = new ExpressAPIBuilder({ application: app, authorizer: defaultRequestAuthorizer })
  const PORT = process.env.PORT ?? 8000
  api.build().listen(PORT, () => {
    console.log(chalk.green('Server is running on port ' + PORT))
    console.log(chalk.blue('Service key') + `: ${serviceKey}`)
  })
}

void StartDevServer()
