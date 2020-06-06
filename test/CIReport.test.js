const path = require('path');
const os = require('os');
const { CIReport } = require('../lib/CIReport');

const rootDir = process.cwd();
afterEach(() => {
  process.chdir(rootDir);
});

describe('CIReport', () => {
  test('it represents xunit.xml', () => {
    const report = new CIReport(path.join(process.cwd(), 'test', 'fixtures', 'backstop', 'failed', 'backstop_data', 'CI_report', 'xunit.xml'));
    expect(report).toBeDefined();
    expect(report.rawReport).toBeDefined();
  });

  test('it merges test result', () => {
    const r1 = new CIReport(path.join(process.cwd(), 'test', 'fixtures', 'backstop', 'tablet_success_sp_failed', 'backstop_data', 'ci_report', 'xunit.xml'));
    const r2 = new CIReport(path.join(process.cwd(), 'test', 'fixtures', 'backstop', 'pass', 'backstop_data', 'ci_report', 'xunit.xml'));

    expect(r1.failedCount).toEqual(1);
    expect(r2.failedCount).toEqual(0);
    expect(r1.passCount).toEqual(1);
    expect(r2.passCount).toEqual(2);
    r1.notifyNewReport(r2);
    expect(r1.failedCount).toEqual(0);
    expect(r2.failedCount).toEqual(0);

    const tmpPath = path.join(os.tmpdir(), Math.random().toString());
    r1.writeTo(tmpPath);
    const wroteReport = new CIReport(tmpPath);
    expect(wroteReport.passCount).toEqual(2);
  });
});