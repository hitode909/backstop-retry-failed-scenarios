const { HTMLReport } = require('../lib/HTMLReport');
const {copy, resolve} = require('test-fixture')()

describe('HTMLReport', () => {
  test('it represents config.js', async () => {
    await copy();
    const report = new HTMLReport(resolve('backstop', 'failed', 'backstop_data', 'html_report', 'config.js'));
    expect(report).toBeDefined();
    expect(report.rawReport).toBeDefined();
  });

  test('it creates filter for retry', async () => {
    await copy();
    const report = new HTMLReport(resolve('backstop', 'failed', 'backstop_data', 'html_report', 'config.js'));
    expect(report.filter).toEqual('^(BackstopJS Homepage)$');
  });

  test('it merges test result', async () => {
    await copy();
    const r1 = new HTMLReport(resolve('backstop', 'tablet_success_sp_failed', 'backstop_data', 'html_report', 'config.js'));
    const r2 = new HTMLReport(resolve('backstop', 'pass', 'backstop_data', 'html_report', 'config.js'));

    expect(r1.failedCount).toEqual(1);
    expect(r2.failedCount).toEqual(0);
    expect(r1.passCount).toEqual(1);
    expect(r2.passCount).toEqual(2);
    r1.notifyNewReport(r2);
    expect(r1.failedCount).toEqual(0);
    expect(r2.failedCount).toEqual(0);

    r1.write();
    const wroteReport = new HTMLReport(r1.reportPath);
    expect(wroteReport.passCount).toEqual(2);
  });
});