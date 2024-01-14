import ZipDirectory from "../../utils/create_zip.js";
import CurrentProject from "../../utils/current_project.js";
import { RunShellCommands } from "../../utils/os.js";

export const BuildProjectAction = async () => {
  const projectConfig = await CurrentProject.getPackageConfig();
  const projectPath = await CurrentProject.getPackageDirectory();
  const projectBundlePath = await CurrentProject.getPackageBundlePath();
  // Upload to S3
  const {
    include: includes,
    scripts: { bundle: commands },
  } = projectConfig;
  await RunShellCommands(commands);
  await ZipDirectory(projectPath, projectBundlePath, includes);
};
