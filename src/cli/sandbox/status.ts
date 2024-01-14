import PreferenceStore from "../../utils/preference_store.js";

export const ShowSandboxStatus = async () => {
  const activeSandbox = await PreferenceStore.getActiveSandbox();
  if (!activeSandbox) {
    console.log("No active sandbox");
    return;
  }
  console.log(`Active Sandbox: ${activeSandbox.name}`);
};