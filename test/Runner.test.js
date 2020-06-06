const { Runner } = require('../lib/Runner');

describe('Runner', () => {
  test('it receives options', () => {
    const runner = new Runner({
      retry: 3,
      config: 'backstop.js',
      command: 'backstop test',
    });
    expect(runner).toBeDefined();
    expect(runner.retryCount).toEqual(3);
    expect(runner.configPath).toEqual('backstop.js');
    expect(runner.command).toEqual('backstop test');
  });

  test('it parses config', () => {
    const runner = new Runner({
      config: 'test/fixtures/backstop.config.json',
    });
    expect(runner.configFullPath).toBeDefined();
    expect(runner.configObject).toBeDefined();
    expect(runner.configObject.paths).toStrictEqual({
        bitmaps_reference: "backstop_data/bitmaps_reference",
        bitmaps_test: "backstop_data/bitmaps_test",
        engine_scripts: "backstop_data/engine_scripts",
        html_report: "backstop_data/html_report",
        json_report: "backstop_data/json_report",
        ci_report: "backstop_data/ci_report",
    });
  });

  describe('run', () => {
    test('it runs once when success on first time', () => {
      const runner = new Runner({
        retry: 3,
        config: 'backstop.js',
        command: 'true',
      });
      expect(runner.run()).toEqual(true);
      expect(runner.retriedCount).toEqual(1);
    });

    test('it retries specified times', () => {
      const runner = new Runner({
        retry: 3,
        config: 'backstop.js',
        command: 'false',
      });
      expect(runner.run()).toEqual(false);
      expect(runner.retriedCount).toEqual(3);
    });
  });
});