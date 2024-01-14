import axios from "axios";
import { readFile } from "fs/promises";
import CurrentProject from "../../utils/current_project.js";
import { ClientAPIService } from "../services/api.js";

export const PublishProjetAction = async () => {
  console.log("Publishing Project Bundle");
  const bundlePath = await CurrentProject.getPackageBundlePath();
  const appConfig = await CurrentProject.getApplicationConfig();
  const projectConfig = await CurrentProject.getPackageConfig();
  const deployConfig = appConfig.project;
  const api = new ClientAPIService(deployConfig);
  const { s3path: s3SignedPath, id: snapshotId } = await api.post(
    `org/${deployConfig.orgId}/project/${deployConfig.projectId}/snapshot/request-upload-url`,
    {
      appPath: projectConfig.app,
    }
  );
  console.log("Generated Upload Path");
  try {
    console.log("Uploading Project Bundle");
    const bundleData = await readFile(bundlePath);
    await axios({
      method: "PUT",
      url: s3SignedPath,
      headers: {
        "Content-Type": "application/zip",
      },
      data: bundleData,
    });
    console.log("Uploaded Project Bundle");
  } catch (error) {
    console.log("Failed to upload project bundle");
    await api.del(
      `org/${deployConfig.orgId}/project/${deployConfig.projectId}/snapshot/${snapshotId}`
    );
    console.log("Deleted snapshot");
    throw error;
  }
};
