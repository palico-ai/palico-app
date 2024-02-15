import { sequelize } from '../../storage/local_storage/database'

interface Options {
  forceSync?: boolean
}

export const SyncDB = async (options: Options): Promise<void> => {
  await sequelize.sync({ force: options.forceSync })
}
