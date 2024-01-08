import { readFileSync } from "fs";
import config from "../config";
import { PalicoConfig } from "../../types";
import { exec } from "child_process";
import { promisify } from "util";

export const GetProjectBuildConfig = (projectPath: string): PalicoConfig => {
  const deployConfigPath = `${projectPath}/${config.ProjectConfigFileName}`;
  const deployConfig: PalicoConfig = JSON.parse(
    readFileSync(deployConfigPath, "utf8")
    );
    return deployConfig;
  };
  
  export const RunShellCommands = async (commands: string[]) : Promise<void> => {
  const execAsync = promisify(exec);
  for (const command of commands) {
    const {stdout, stderr} = await execAsync(command);
    console.log(stdout)
    if (stderr) {
      throw stderr;
    }
  }
}