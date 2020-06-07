/* eslint-disable node/no-unpublished-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const {copy, resolve} = require('test-fixture')();

import {JSONReport} from '../lib/JSONReport';

describe('JSONReport', () => {
  test('it represents jsonReport.json', async () => {
    await copy();
    const report = new JSONReport(
      resolve(
        'backstop',
        'failed',
        'backstop_data',
        'json_report',
        'jsonReport.json'
      )
    );
    expect(report).toBeDefined();
    expect(report.rawReport).toBeDefined();
  });

  test('it merges test result', async () => {
    await copy();
    const r1 = new JSONReport(
      resolve(
        'backstop',
        'tablet_success_sp_failed',
        'backstop_data',
        'json_report',
        'jsonReport.json'
      )
    );
    const r2 = new JSONReport(
      resolve(
        'backstop',
        'pass',
        'backstop_data',
        'json_report',
        'jsonReport.json'
      )
    );

    expect(r1.failedCount).toEqual(1);
    expect(r2.failedCount).toEqual(0);
    expect(r1.passCount).toEqual(1);
    expect(r2.passCount).toEqual(2);
    r1.notifyNewReport(r2);
    expect(r1.failedCount).toEqual(0);
    expect(r2.failedCount).toEqual(0);

    r1.write();
    const wroteReport = new JSONReport(r1.reportPath);
    expect(wroteReport.passCount).toEqual(2);
  });
});
