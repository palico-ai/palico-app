import { CurrentProject } from './current_project'

enum PreferenceKey {
  ActiveSandboxID = 'ActiveSandboxID',
  ActiveSandboxName = 'ActiveSandboxName',
}

export interface ActiveSandbox {
  id: number
  name: string
}

interface ConfigStore {
  get: <T = any>(key: PreferenceKey) => Promise<T | undefined>
  set: (key: PreferenceKey, value: any) => void
  delete: (key: PreferenceKey) => void
}

export class PreferenceStore {
  private static _configStore: ConfigStore

  private static async getConfigStore (): Promise<ConfigStore> {
    if (!PreferenceStore._configStore) {
      const directory = await CurrentProject.getPackageDirectory()
      // eslint-disable-next-line no-eval
      const ConfigStoreImport = await eval("import('configstore')")
      // eslint-disable-next-line new-cap
      PreferenceStore._configStore = new ConfigStoreImport.default(
        `palico-cli-${directory}`
      )
    }
    return PreferenceStore._configStore
  }

  static async get<T = any>(key: PreferenceKey): Promise<T | undefined> {
    const configStore = await PreferenceStore.getConfigStore()
    return await configStore.get(key)
  }

  static async set (key: PreferenceKey, value: any): Promise<void> {
    const configStore = await PreferenceStore.getConfigStore()
    configStore.set(key, value)
  }

  static async delete (key: PreferenceKey): Promise<void> {
    const configStore = await PreferenceStore.getConfigStore()
    configStore.delete(key)
  }

  static async setActiveSandbox (sandbox: ActiveSandbox): Promise<void> {
    const configStore = await PreferenceStore.getConfigStore()
    configStore.set(PreferenceKey.ActiveSandboxID, sandbox.id)
    configStore.set(PreferenceKey.ActiveSandboxName, sandbox.name)
  }

  static async getActiveSandbox (): Promise<ActiveSandbox | undefined> {
    const cs = await PreferenceStore.getConfigStore()
    const id = await cs.get(PreferenceKey.ActiveSandboxID)
    const name = await cs.get(PreferenceKey.ActiveSandboxName)
    if (!id || !name) return undefined
    return {
      id,
      name
    }
  }
}
