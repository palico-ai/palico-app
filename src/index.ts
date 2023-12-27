import { Command } from 'commander';
const program = new Command();

program
  .command('hello')
  .description('hello world')
  .action(() => {
    console.log('hello world');
  });

program.parse();