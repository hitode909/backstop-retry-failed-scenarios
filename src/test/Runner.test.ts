/* eslint-disable node/no-unpublished-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const {copy, resolve} = require('test-fixture')();

import fs from 'fs';
import {Runner} from '../lib/Runner';

describe('Runner', () => {
  test('it receives options', async () => {
    await copy();
    const runner = new Runner({
      retry: 3,
      config: 'backstop.json',
      command: 'backstop test',
      referenceCommand: 'backstop reference',
      outputProfile: 'profile.json',
      rootDir: resolve('backstop/failed'),
    });
    expect(runner).toBeDefined();
    expect(runner.retryCount).toEqual(3);
    expect(runner.configPath).toEqual('backstop.json');
    expect(runner.command).toEqual('backstop test');
    expect(runner.referenceCommand).toEqual('backstop reference');
    expect(runner.outputProfile).toEqual('profile.json');
  });

  test('it parses config', async () => {
    await copy();
    const runner = new Runner({
      config: 'backstop.json',
      rootDir: resolve('backstop/failed'),
    });
    expect(runner.config).toBeDefined();
    expect(runner.config.htmlReport).toBeDefined();
  });

  describe('run', () => {
    test('it runs once when pass on first time', async () => {
      await copy();
      const runner = new Runner({
        retry: 3,
        config: 'backstop.json',
        command: 'cal -y',
        referenceCommand: 'cal',
        rootDir: resolve('backstop/failed'),
      });
      expect(await runner.run()).toEqual(true);
      expect(runner.retriedCount).toEqual(1);
    });

    test('it retries specified times', async () => {
      await copy();
      const runner = new Runner({
        retry: 3,
        config: 'backstop.json',
        referenceCommand: 'not_existing_command',
        command: 'not_existing_command',
        rootDir: resolve('backstop/failed'),
      });
      expect(await runner.run()).toEqual(false);
      expect(runner.retriedCount).toEqual(3);
    });

    test('it generates output profile', async () => {
      await copy();
      const outputProfile = resolve('profile.json');
      const runner = new Runner({
        retry: 2,
        config: 'backstop.json',
        referenceCommand: 'not_existing_command',
        command: 'not_existing_command',
        outputProfile,
        rootDir: resolve('backstop/failed'),
      });
      await runner.run();
      expect(JSON.parse(fs.readFileSync(outputProfile).toString())).toEqual([
        {
          label: 'backstop.run',
          duration: expect.any(Number),
          startTime: expect.any(Number),
          endTime: expect.any(Number),
        },
        {
          label: 'backstop.1.reference',
          duration: expect.any(Number),
          startTime: expect.any(Number),
          endTime: expect.any(Number),
        },
        {
          label: 'backstop.1.test',
          duration: expect.any(Number),
          startTime: expect.any(Number),
          endTime: expect.any(Number),
        },
        {
          label: 'backstop.2.reference',
          duration: expect.any(Number),
          startTime: expect.any(Number),
          endTime: expect.any(Number),
        },
        {
          label: 'backstop.2.test',
          duration: expect.any(Number),
          startTime: expect.any(Number),
          endTime: expect.any(Number),
        },
      ]);
    });
  });

  describe('createFilter', () => {
    test('it creates filter from report', async () => {
      await copy();
      const runner = new Runner({
        config: 'backstop.json',
        rootDir: resolve('backstop/failed'),
      });
      expect(runner.filter).toEqual('^(BackstopJS Homepage)$');
    });
  });
});
