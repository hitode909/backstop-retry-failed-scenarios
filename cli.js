#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const { Runner } = require('./lib/Runner');

const optionDefinitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.'
  },
  {
    name: 'retry',
    type: Number,
    defaultValue: 3,
    description: 'Retry count'
  },
  {
    name: 'config',
    type: String,
    defaultValue: 'backstop.json',
    description: 'Path to config file',
  },
  {
    name: 'command',
    type: String,
    defaultValue: 'backstop test',
    description: 'Command to run test',
  },
];
const options = commandLineArgs(optionDefinitions);


if (options.help) {
  const usage = commandLineUsage([
    {
      header: 'backstop-retry-failed-scenarios',
      content: 'A wrapper script to retry failed scenario for BackstopJS.'
    },
    {
      header: 'Options',
      optionList: optionDefinitions
    },
  ])
  console.log(usage);
  process.exit(0);
}

console.log(options);

const main = async () => {
  const runner = new Runner(options);
  await runner.run();
  process.exit(runner.exitCode);
};
main();