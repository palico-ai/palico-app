import ZipDirectory from '../../utils/create_zip.js'
import CurrentProject from '../../utils/current_project.js'

export const BuildProjectAction = async (): Promise<void> => {
  const projectConfig = await CurrentProject.getPackageConfig()
  const projectPath = await CurrentProject.getPackageDirectory()
  const projectBundlePath = await CurrentProject.getPackageBundlePath()
  await CurrentProject.buildApplication()
  // Upload to S3
  const { include: includes } = projectConfig
  await ZipDirectory(projectPath, projectBundlePath, includes)
}
