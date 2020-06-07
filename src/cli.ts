#!/usr/bin/env node
/* eslint-disable no-process-exit */

import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import {Runner} from './lib/Runner';

const optionDefinitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.',
  },
  {
    name: 'retry',
    type: Number,
    defaultValue: 3,
    description: 'Retry count. default: 3',
  },
  {
    name: 'config',
    type: String,
    defaultValue: 'backstop.json',
    description: 'Path to config file. default: backstop.json',
  },
  {
    name: 'command',
    type: String,
    defaultValue: 'backstop test',
    description: 'Command to run test. default: backstop test',
  },
];
const options = commandLineArgs(optionDefinitions);

if (options.help) {
  const usage = commandLineUsage([
    {
      header: 'backstop-retry-failed-scenarios',
      content: 'A wrapper script to retry failed scenario for BackstopJS.',
    },
    {
      header: 'Options',
      optionList: optionDefinitions,
    },
  ]);
  console.log(usage);
  process.exit(0);
}

console.log(options);

const main = async () => {
  const runner = new Runner({
    rootDir: process.cwd(),
    retry: options.retry,
    config: options.config,
    command: options.command,
  });
  await runner.run();
  process.exit(runner.exitCode);
};
main();
