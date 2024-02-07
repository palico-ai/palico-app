#!/usr/bin/env node

import { Command } from 'commander'
import { ServeDevServer } from './__root__/dev.js'

const root = new Command()

root.command('dev').description('starts local server').action(ServeDevServer)

root.parse()
