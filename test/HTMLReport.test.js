const path = require('path');
const { HTMLReport } = require('../lib/HTMLReport');

const rootDir = process.cwd();
afterEach(() => {
  process.chdir(rootDir);
});

describe('HTMLReport', () => {
  test('it represents config.js', () => {
    const report = new HTMLReport(path.join(process.cwd(), 'test', 'fixtures', 'backstop', 'failed', 'backstop_data', 'html_report', 'config.js'));
    expect(report).toBeDefined();
    expect(report.rawReport).toBeDefined();
  });

  test('it creates filter for retry', () => {
    const report = new HTMLReport(path.join(process.cwd(), 'test', 'fixtures', 'backstop', 'failed', 'backstop_data', 'html_report', 'config.js'));
    expect(report.filter).toEqual('^(BackstopJS Homepage)$');
  });

  test('it merges test result', () => {
    const r1 = new HTMLReport(path.join(process.cwd(), 'test', 'fixtures', 'backstop', 'failed', 'backstop_data', 'html_report', 'config.js'));
    const r2 = new HTMLReport(path.join(process.cwd(), 'test', 'fixtures', 'backstop', 'pass', 'backstop_data', 'html_report', 'config.js'));

    expect(r1.failedCount).toEqual(2);
    expect(r2.failedCount).toEqual(0);
    expect(r1.passCount).toEqual(0);
    expect(r2.passCount).toEqual(2);
    r1.notifyNewReport(r2);
    expect(r1.failedCount).toEqual(0);
    expect(r2.failedCount).toEqual(0);
  });
});