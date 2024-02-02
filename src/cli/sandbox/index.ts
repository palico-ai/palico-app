import { Command } from 'commander'
import { ShowSandboxStatus } from './status.js'
import { SandboxCheckoutHandler } from './checkout.js'
import ServeSandboxAction from './serve.js'

export const SandboxCommand = new Command('sandbox')

SandboxCommand.command('status')
  .description('View Current Sandbox Details')
  .action(ShowSandboxStatus)

SandboxCommand.command('checkout')
  .description('checkout a sandbox')
  .argument('<name>', 'sandbox name')
  .option('-c, --create', 'Create a new sandbox if not exists', false)
  .action(SandboxCheckoutHandler)

SandboxCommand.command('serve')
  .description('deploy current project to a sandbox')
  .action(ServeSandboxAction)
