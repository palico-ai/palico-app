import CurrentProject from "../../utils/current_project.js";
import PreferenceStore from "../../utils/preference_store.js";
import { ClientAPIService } from "../services/api.js";

interface CheckoutOptions {
  create: boolean;
}

interface SandboxItem {
  id: number;
  name: string;
}

const getProjectSandboxList = async (): Promise<SandboxItem[]> => {
  const api = await ClientAPIService.instance();
  const { orgId, projectId } = await CurrentProject.getProjectDetails();
  const sandboxes = await api.get(`org/${orgId}/project/${projectId}/sandbox`);
  return sandboxes.items;
};

const createSandbox = async (sandboxName: string): Promise<SandboxItem> => {
  const api = await ClientAPIService.instance();
  const { orgId, projectId } = await CurrentProject.getProjectDetails();
  const sandbox = await api.post(`org/${orgId}/project/${projectId}/sandbox`, {
    name: sandboxName,
  });
  return sandbox;
};

export const SandboxCheckoutHandler = async (
  sandboxName: string,
  options: CheckoutOptions
) => {
  const sandboxes = await getProjectSandboxList();
  let targetSandbox = sandboxes.find((sandbox) => sandbox.name === sandboxName);
  if (!targetSandbox && options.create) {
    targetSandbox = await createSandbox(sandboxName);
  } else if (!targetSandbox) {
    throw new Error(`Sandbox '${sandboxName}' does not exist`);
  }
  await PreferenceStore.setActiveSandbox(targetSandbox);
};
