import { HTMLReport } from '../lib/HTMLReport';
import { createTestFixture } from './testHelpers';

describe('HTMLReport', () => {
  const fixture = createTestFixture();

  test('it represents config.js', async () => {
    await fixture.copy();
    const report = new HTMLReport(
      fixture.resolve('backstop', 'failed', 'backstop_data', 'html_report', 'config.js')
    );
    expect(report).toBeDefined();
    expect(report.rawReport).toBeDefined();
  });

  test('it creates filter for retry', async () => {
    await fixture.copy();
    const report = new HTMLReport(
      fixture.resolve('backstop', 'failed', 'backstop_data', 'html_report', 'config.js')
    );
    expect(report.filter).toEqual('^(BackstopJS Homepage)$');
  });

  test('it merges test result', async () => {
    await fixture.copy();
    const r1 = new HTMLReport(
      fixture.resolve(
        'backstop',
        'tablet_success_sp_failed',
        'backstop_data',
        'html_report',
        'config.js'
      )
    );
    const r2 = new HTMLReport(
      fixture.resolve('backstop', 'pass', 'backstop_data', 'html_report', 'config.js')
    );

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
