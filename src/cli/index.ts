#!/usr/bin/env node

import { Command } from "commander";
import BuildProjectAction from "./actions/bundle";
import PublishProjetAction from "./actions/publish";
const program = new Command();

program
  .command("hello")
  .description("hello world")
  .action(() => {
    console.log("hello world");
  });

program
  .command("build")
  .description("build project")
  .action(BuildProjectAction);

program
  .command("publish")
  .description("publish project")
  .action(PublishProjetAction);

program.parse();
