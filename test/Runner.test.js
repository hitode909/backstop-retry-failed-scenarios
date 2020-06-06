const { Runner } = require('../lib/Runner');

const rootDir = process.cwd();
afterEach(() => {
  process.chdir(rootDir);
});

describe('Runner', () => {
  test('it receives options', () => {
    process.chdir('test/fixtures/backstop/failed');
    const runner = new Runner({
      retry: 3,
      config: 'backstop.json',
      command: 'backstop test',
    });
    expect(runner).toBeDefined();
    expect(runner.retryCount).toEqual(3);
    expect(runner.configPath).toEqual('backstop.json');
    expect(runner.command).toEqual('backstop test');
  });

  test('it parses config', () => {
    process.chdir('test/fixtures/backstop/failed');
    const runner = new Runner({
      config: 'backstop.json',
    });
    expect(runner.config).toBeDefined();
    expect(runner.config.htmlReport).toBeDefined();
  });

  describe('run', () => {
    test('it runs once when success on first time', async () => {
      process.chdir('test/fixtures/backstop/failed');
      const runner = new Runner({
        retry: 3,
        config: 'backstop.json',
        command: 'cal -y',
      });
      expect(await runner.run()).toEqual(true);
      expect(runner.retriedCount).toEqual(1);
    });

    test('it retries specified times', async () => {
      process.chdir('test/fixtures/backstop/failed');
      const runner = new Runner({
        retry: 3,
        config: 'backstop.json',
        command: 'not_existing_command',
      });
      expect(await runner.run()).toEqual(false);
      expect(runner.retriedCount).toEqual(3);
    });
  });

  describe('createFilter', () => {
    test('it creates filter from report', () => {
      process.chdir('test/fixtures/backstop/failed');
      const runner = new Runner({
        config: 'backstop.json',
      });
      expect(runner.filter).toEqual('^(BackstopJS Homepage)$');
    });
  });
});