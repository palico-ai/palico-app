// import { type UserConfig } from '../user_app/types'
// import CurrentProject from '../utils/current_project'
// import EventHandler from './request_handler'

import { Application } from '../app'
import { LocalStorage } from '../storage'
import { sequelize } from '../storage/local_storage/database'
import { CurrentProject } from '../utils'
import type * as express from 'express'
import { ExpressAPIBuilder } from './express_api_builder'
import { defaultRequestAuthorizer } from './middlewares/local_authorizer'

export interface DevServerOutput {
  api: express.Application
  sequelize: typeof sequelize
}

export const CreateDevServer = async (): Promise<DevServerOutput> => {
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
  const api = new ExpressAPIBuilder({
    application: app,
    authorizer: defaultRequestAuthorizer
  })
  return {
    api: api.build(),
    sequelize
  }
}
