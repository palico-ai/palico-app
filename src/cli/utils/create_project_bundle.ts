import { readFileSync } from "fs"
import ZipDirectory from "./create_zip"
import { PalicoConfig } from "../../types"
import config from "../config"
import { RunShellCommands } from "./os"
import { GetProjectBundlePath } from "./current_project"

interface Props {
  projectPath: string
}

const CreateProjectBundle = async (props: Props) => {
  const {projectPath} = props
  const deployConfig : PalicoConfig = JSON.parse(readFileSync(`${projectPath}/${config.ProjectConfigFileName}`, 'utf8'))
  // Upload to S3
  const {
    include: includes, 
    scripts: {
      bundle: commands
    } 
  } = deployConfig
  await RunShellCommands(commands)
  await ZipDirectory(projectPath, GetProjectBundlePath(projectPath) , includes)
}

export default CreateProjectBundle