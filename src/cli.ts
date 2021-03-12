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
    defaultValue: 2,
    description: 'Trial count. default: 2(Run once, retry once). minimum: 2',
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
  {
    name: 'reference-command',
    type: String,
    defaultValue: null,
    description:
      'Command to create reference before testing. Default: null (Do not create reference before test).',
  },
  {
    name: 'output-profile',
    type: String,
    defaultValue: null,
    description:
      'Path to profiler output file. If present, measure the execution time and output the report as JSON.',
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

const main = async () => {
  const runner = new Runner({
    rootDir: process.cwd(),
    retry: options.retry,
    config: options.config,
    command: options.command,
    referenceCommand: options['reference-command'],
    outputProfile: options['output-profile'],
  });
  await runner.run();
  process.exit(runner.exitCode);
};
main();
