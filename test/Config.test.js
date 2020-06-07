const path = require('path');
const { Config } = require('../lib/Config');
const {copy, resolve} = require('test-fixture')();

describe('Config', () => {
  test('it represents backstop.json config', async () => {
    await copy();
    const dir = resolve('backstop', 'failed');
    const config = new Config(dir, 'backstop.json');
    expect(config).toBeDefined();
    expect(config.rawConfig).toBeDefined();
    expect(config.htmlReportPath).toEqual(path.join(dir, 'backstop_data', 'html_report', 'config.js'));
    expect(config.htmlReport).toBeDefined();
    expect(config.jsonReportPath).toEqual(path.join(dir, 'backstop_data', 'json_report', 'jsonReport.json'));
    expect(config.jsonReport).toBeDefined();
    expect(config.ciReportPath).toEqual(path.join(dir, 'backstop_data', 'ci_report', 'xunit.xml'));
    expect(config.ciReport).toBeDefined();
  });

  test('it reads paths', async () => {
    await copy();
    const dir = resolve('backstop', 'custom_report_path');
    const config = new Config(dir, 'backstop.json');
    expect(config.htmlReportPath).toEqual(path.join(dir, 'custom_backstop_data', 'html_report', 'config.js'));
    expect(config.jsonReportPath).toEqual(path.join(dir, 'custom_backstop_data', 'json_report', 'jsonReport.json'));
    expect(config.ciReportPath).toEqual(path.join(dir, 'custom_backstop_data', 'ci_report', 'xunit.xml'));
  });

  test('jsonReport and ciReport are optional', async () => {
    await copy();
    const dir = resolve('backstop', 'failed_html_only');
    const config = new Config(dir, 'backstop.json');
    expect(config.htmlReport).toBeDefined();
    expect(config.jsonReport).toEqual(null);
    expect(config.ciReport).toEqual(null);
  });
});