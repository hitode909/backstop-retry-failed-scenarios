const path = require('path');
const { HTMLReport } = require('../lib/HTMLReport');

const rootDir = process.cwd();
afterEach(() => {
  process.chdir(rootDir);
});

describe('HTMLReport', () => {
  test('it represents config.js', () => {
    const report = new HTMLReport(path.join(process.cwd(), 'test/fixtures', 'backstop', 'failed', 'backstop_data', 'html_report', 'config.js'));
    expect(report).toBeDefined();
    expect(report.rawReport).toBeDefined();
  });

  test('it creates filter for retry', () => {
    const report = new HTMLReport(path.join(process.cwd(), 'test/fixtures', 'backstop', 'failed', 'backstop_data', 'html_report', 'config.js'));
    expect(report.filter).toEqual('^(BackstopJS Homepage)$');
  });
});