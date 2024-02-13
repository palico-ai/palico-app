import * as chalk from 'chalk'
import { defaultRequestAuthorizer } from '../../../api/middlewares/local_authorizer'
import { Application } from '../../../app'
import { LocalStorage } from '../../../storage/local_storage'
import { sequelize } from '../../../storage/local_storage/database'
import { CurrentProject } from '../../../utils/current_project'
import JWTAuthenticator from '../../../utils/jwt'
import { PreferenceStore } from '../../../utils/preference_store'
import config from '../../../config'
import { ExpressAPIBuilder } from '../../../api/express_api_builder'

interface AuthorizationTokenParams {
  currentSecret: string
  serviceKey: string
}

const GetJWTToken = async (): Promise<string> => {
  const preferenceKey = 'JWTAuth'
  const secret = process.env.JWT_SECRET ?? config.DefaultLocalSecret
  const currentAuth = await PreferenceStore.get<AuthorizationTokenParams>(preferenceKey)
  if (!currentAuth?.serviceKey) {
    console.log("Service Key doesn't exist...")
    console.log('Creating new service key')
    const serviceKey = await JWTAuthenticator.generateAPIJWT({ deploymentId: -1 }, secret)
    await PreferenceStore.set(preferenceKey, {
      currentSecret: secret,
      serviceKey
    })
    return serviceKey
  }
  // If secret has changed
  if (currentAuth?.currentSecret !== secret) {
    console.log('JWT Secret has changed')
    console.log('Creating new JWT Secret')
    const serviceKey = await JWTAuthenticator.generateAPIJWT({ deploymentId: -1 }, secret)
    await PreferenceStore.set<AuthorizationTokenParams>(preferenceKey, {
      currentSecret: secret,
      serviceKey
    })
    return serviceKey
  }
  return currentAuth.serviceKey
}

// Compiles the application with specific build command and starts the server
export const StartDevServer = async (): Promise<void> => {
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
  const serviceKey = await GetJWTToken()
  const api = new ExpressAPIBuilder({ application: app, authorizer: defaultRequestAuthorizer })
  const PORT = process.env.PORT ?? 8002
  api.build().listen(PORT, () => {
    console.log(chalk.green('Server is running on port ' + PORT))
    console.log(chalk.blue('Service key') + `: ${serviceKey}`)
  })
}

void StartDevServer()
