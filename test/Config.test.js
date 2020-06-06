const path = require('path');
const { Config } = require('../lib/Config');

const rootDir = process.cwd();
afterEach(() => {
  process.chdir(rootDir);
});

describe('Config', () => {
  test('it represents backstop.json config', () => {
    const dir = path.join(process.cwd(), 'test', 'fixtures', 'backstop', 'failed');
    const config = new Config(dir, 'backstop.json');
    expect(config).toBeDefined();
    expect(config.rawConfig).toBeDefined();
    expect(config.htmlReportPath).toEqual(path.join(dir, 'backstop_data', 'html_report', 'config.js'));
    expect(config.htmlReport).toBeDefined();
    expect(config.jsonReportPath).toEqual(path.join(dir, 'backstop_data', 'json_report', 'jsonReport.json'));
    expect(config.ciReportPath).toEqual(path.join(dir, 'backstop_data', 'ci_report', 'xunit.xml'));
  });

  test('it reads paths', () => {
    const dir = path.join(process.cwd(), 'test', 'fixtures', 'backstop', 'custom_report_path');
    const config = new Config(dir, 'backstop.json');
    expect(config.htmlReportPath).toEqual(path.join(dir, 'custom_backstop_data', 'html_report', 'config.js'));
    expect(config.jsonReportPath).toEqual(path.join(dir, 'custom_backstop_data', 'json_report', 'jsonReport.json'));
    expect(config.ciReportPath).toEqual(path.join(dir, 'custom_backstop_data', 'ci_report', 'xunit.xml'));
  });
});