import * as findUp from "find-up";
import { readFileSync } from "fs";
import { ApplicationConfig, PackageConfig, ProjectConfig } from "../types";
import config from "../config";

export default class CurrentProject {
  private static projectPath: string;
  private static projectConfig: PackageConfig;
  private static applicationConfig: any;

  static async getPackageDirectory(): Promise<string> {
    if (this.projectPath) {
      return this.projectPath;
    }
    const path = await findUp(config.ProjectConfigFileName);
    if (!path) {
      throw new Error("Failed to find project root");
    }
    this.projectPath = path.replace(`/${config.ProjectConfigFileName}`, "");
    return this.projectPath;
  }

  static async getPackageConfig(): Promise<PackageConfig> {
    if (this.projectConfig) {
      return this.projectConfig;
    }
    const projectRootPath = await this.getPackageDirectory();
    this.projectConfig = JSON.parse(
      readFileSync(`${projectRootPath}/${config.ProjectConfigFileName}`, "utf8")
    );
    return this.projectConfig;
  }

  static async getApplicationConfig(): Promise<ApplicationConfig> {
    if (this.applicationConfig) {
      return this.applicationConfig;
    }
    const projectRootPath = await this.getPackageDirectory();
    const config = await this.getPackageConfig();
    this.applicationConfig =
      require(`${projectRootPath}/${config.app}`).default;
    return this.applicationConfig;
  }

  static async getProjectDetails(): Promise<ProjectConfig> {
    const appConfig = await this.getApplicationConfig();
    return appConfig.project;
  }

  static async getPackageBundlePath() {
    const projectRootPath = await this.getPackageDirectory();
    const config = await this.getPackageConfig();
    return `${projectRootPath}/${config.BuildDirectory}/${config.BundleFileKey}`;
  }
}
