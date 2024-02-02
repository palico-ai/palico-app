import { readFile } from 'fs/promises'
import CurrentProject, { type ApplicationBundle } from '../../utils/current_project'
import { ClientAPIService } from '../services/api'
import axios from 'axios'

const GetUploadURL = async (bundle: ApplicationBundle): Promise<string> => {
  const sandbox = await CurrentProject.getOrThrowActiveSandbox()
  const { project: projectConfig } = await CurrentProject.getApplicationConfig()
  const api = await ClientAPIService.instance()
  const { uploadUrl } = await api.post(
    `org/${projectConfig.orgId}/project/${projectConfig.projectId}/sandbox/${sandbox.id}/request-new-deployment`,
    {
      appPath: bundle.metadata.appEntryPath
    }
  )
  return uploadUrl
}

const UploadBundle = async (uploadUrl: string, bundle: ApplicationBundle): Promise<void> => {
  const bundleData = await readFile(bundle.bundlePath)
  await axios({
    method: 'PUT',
    url: uploadUrl,
    headers: {
      'Content-Type': 'application/zip'
    },
    data: bundleData
  })
}

const DeployBundle = async (bundle: ApplicationBundle): Promise<void> => {
  const api = await ClientAPIService.instance()
  const { project: projectConfig } = await CurrentProject.getApplicationConfig()
  const sandbox = await CurrentProject.getOrThrowActiveSandbox()
  if (!sandbox) {
    throw new Error(
      'No active sandbox. Please run \'sandbox checkout\' to select a sandbox'
    )
  }
  await api.post(
      `org/${projectConfig.orgId}/project/${projectConfig.projectId}/sandbox/${sandbox.id}/deploy-staged-asset`,
      {
        appPath: bundle.metadata.appEntryPath
      }
  )
}

const ServeSandboxAction = async (): Promise<void> => {
  console.log('Creating application bundle')
  const bundle = await CurrentProject.createApplicationBundle()
  console.log('Uploading application bundle')
  const uploadUrl = await GetUploadURL(bundle)
  await UploadBundle(uploadUrl, bundle)
  console.log('Deploying application bundle')
  await DeployBundle(bundle)
  console.log('Sandbox deployed')
}

export default ServeSandboxAction
