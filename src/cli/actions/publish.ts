import axios from "axios";
import ClientAPIService from "../services/api";
import { GetProjectBuildConfig } from "../utils/os";
import { readFile } from "fs/promises";
import { GetProjectApp, GetProjectBundlePath } from "../utils/current_project";

const PublishProjetAction = async () => {
  console.log("Publishing Project Bundle")
  const projectPath = process.cwd();
  const bundlePath = GetProjectBundlePath(projectPath);
  const app = GetProjectApp(projectPath);
  const appConfig = app.config.project;
  const buildConfig = GetProjectBuildConfig(projectPath);
  const api = new ClientAPIService(appConfig);
  const { s3path: s3SignedPath, id: snapshotId } = await api.post(
    `org/${appConfig.orgId}/project/${appConfig.projectId}/snapshot/request-upload-url`,
    {
      appPath: buildConfig.app
    }
  );
  console.log("Generated Upload Path")
  try {
    console.log("Uploading Project Bundle")
    const bundleData = await readFile(bundlePath);
    await axios({
      method: "PUT",
      url: s3SignedPath,
      headers: {
        "Content-Type": "application/zip",
      },
      data: bundleData,
    });
    console.log("Uploaded Project Bundle")
  } catch (error) {
    console.log("Failed to upload project bundle")
    await api.del(`org/${appConfig.orgId}/project/${appConfig.projectId}/snapshot/${snapshotId}`)
    console.log("Deleted snapshot")
    throw error;
  }
};

export default PublishProjetAction;
