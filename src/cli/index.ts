#!/usr/bin/env node

import { Command } from 'commander'
import { ServeDevServer } from './__root__/dev'

const root = new Command()

root.command('dev')
  .description('starts local server')
  .option('-p, --port <port>', 'port to run server on')
  .option('--force-sync', 'force sync database')
  .action(ServeDevServer)

root.parse()
