/* eslint-disable node/no-unpublished-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const {copy, resolve} = require('test-fixture')();
import {CIReport} from '../lib/CIReport';

describe('CIReport', () => {
  test('it represents xunit.xml', async () => {
    await copy();
    const report = new CIReport(
      resolve('backstop', 'failed', 'backstop_data', 'ci_report', 'xunit.xml')
    );
    expect(report).toBeDefined();
    expect(report.rawReport).toBeDefined();
  });

  test('it merges test result', async () => {
    await copy();
    const r1 = new CIReport(
      resolve(
        'backstop',
        'tablet_success_sp_failed',
        'backstop_data',
        'ci_report',
        'xunit.xml'
      )
    );
    const r2 = new CIReport(
      resolve('backstop', 'pass', 'backstop_data', 'ci_report', 'xunit.xml')
    );

    expect(r1.failedCount).toEqual(1);
    expect(r2.failedCount).toEqual(0);
    expect(r1.passCount).toEqual(1);
    expect(r2.passCount).toEqual(2);
    r1.notifyNewReport(r2);
    expect(r1.failedCount).toEqual(0);
    expect(r2.failedCount).toEqual(0);

    r1.write();
    const wroteReport = new CIReport(r1.reportPath);
    expect(wroteReport.passCount).toEqual(2);
  });

  test('it can parse single result', async () => {
    await copy();
    const r1 = new CIReport(
      resolve(
        'backstop',
        'failed_single',
        'backstop_data',
        'ci_report',
        'xunit.xml'
      )
    );
    expect(r1.failedCount).toEqual(1);
    expect(r1.passCount).toEqual(0);
  });
});
