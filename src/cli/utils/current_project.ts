import { readFileSync } from "fs"
import { PalicoConfig } from "../../types"
import config from "../config"
import Application from "../../application"

export const GetPalicoConfig = (projectPath: string = process.cwd()) : PalicoConfig => {
  const deployConfig : PalicoConfig = JSON.parse(readFileSync(`${projectPath}/${config.ProjectConfigFileName}`, 'utf8'))
  return deployConfig
}

export const GetProjectBundlePath = (projectPath: string = process.cwd()) => {
  return `${projectPath}/${config.BuildDirectory}/${config.BundleFileKey}`
}

export const GetProjectApp = (projectPath: string = process.cwd()) : Application => {
  const config = GetPalicoConfig(projectPath)
  return require(`${projectPath}/${config.app}`).default
}