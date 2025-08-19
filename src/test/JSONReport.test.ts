import { JSONReport } from '../lib/JSONReport';
import { JSONRawReport } from '../lib/Types';
import { createTestFixture } from './testHelpers';

const mapForTest = (report: JSONRawReport) => {
  return report.tests.map(t => {
    return {
      status: t.status,
      fileName: t.pair.fileName,
    };
  });
};

const allPass = [
  {
    status: 'pass',
    fileName:
      'backstop_default_BackstopJS_Homepage_0_imggithub-icon_0_tablet.png',
  },
  {
    status: 'pass',
    fileName:
      'backstop_default_BackstopJS_Homepage_1_imggithub-icon__n1_0_tablet.png',
  },
];

describe('JSONReport', () => {
  const fixture = createTestFixture();
  test('it represents jsonReport.json', async () => {
    await fixture.copy();
    const report = new JSONReport(
      fixture.resolve(
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
    await fixture.copy();
    const r1 = new JSONReport(
      fixture.resolve(
        'backstop',
        'tablet_success_sp_failed',
        'backstop_data',
        'json_report',
        'jsonReport.json'
      )
    );
    const r2 = new JSONReport(
      fixture.resolve(
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

  test('2fail to 2pass', async () => {
    await fixture.copy();
    const r1 = new JSONReport(
      fixture.resolve(
        'backstop/failed-multi-elements/all-failed/backstop_data/json_report',
        'jsonReport.json'
      )
    );
    const r2 = new JSONReport(
      fixture.resolve(
        'backstop/failed-multi-elements/all-success/backstop_data/json_report',
        'jsonReport.json'
      )
    );

    r1.notifyNewReport(r2);

    expect(mapForTest(r1.rawReport)).toStrictEqual(allPass);
  });

  test('1pass1fail to 2pass', async () => {
    await fixture.copy();
    const r1 = new JSONReport(
      fixture.resolve(
        'backstop/failed-multi-elements/1fail1pass/backstop_data/json_report',
        'jsonReport.json'
      )
    );
    const r2 = new JSONReport(
      fixture.resolve(
        'backstop/failed-multi-elements/all-success/backstop_data/json_report',
        'jsonReport.json'
      )
    );

    r1.notifyNewReport(r2);

    expect(mapForTest(r1.rawReport)).toStrictEqual(allPass);
  });
});
