#!/usr/bin/env node

import { Command } from "commander";
import { BuildProjectAction } from "./actions/bundle.js";
import { PublishProjetAction } from "./actions/publish.js";
import { ServeDevServer } from "./actions/serve.js";
import { SandboxCommand } from "./sandbox/index.js";

const root = new Command();

root
  .command("hello")
  .argument("<name>", "name of the user")
  .option("-t, --title <title>", "title of the user")
  .action((name, options) => {
    console.log(`Hello ${name}`);
    console.log(`Title: ${options.title}`);
  });

root.command("build").description("build project").action(BuildProjectAction);

root
  .command("publish")
  .description("publish project")
  .action(PublishProjetAction);

root.command("serve").description("serve project").action(ServeDevServer);

root.addCommand(SandboxCommand);

root.parse();
