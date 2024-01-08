import CreateProjectBundle from "../utils/create_project_bundle"

const BuildProjectAction = async () => {
  await CreateProjectBundle({
    projectPath: process.cwd()
  })
}

export default BuildProjectAction