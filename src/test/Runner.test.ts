/* eslint-disable node/no-unpublished-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const {copy, resolve} = require('test-fixture')();

import {Runner} from '../lib/Runner';

describe('Runner', () => {
  test('it receives options', async () => {
    await copy();
    const runner = new Runner({
      retry: 3,
      config: 'backstop.json',
      command: 'backstop test',
      rootDir: resolve('backstop/failed'),
    });
    expect(runner).toBeDefined();
    expect(runner.retryCount).toEqual(3);
    expect(runner.configPath).toEqual('backstop.json');
    expect(runner.command).toEqual('backstop test');
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
        command: 'not_existing_command',
        rootDir: resolve('backstop/failed'),
      });
      expect(await runner.run()).toEqual(false);
      expect(runner.retriedCount).toEqual(3);
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
