import fs from 'fs';
import parser from 'xml2json';

import {CIRawReport} from './Types';

const flat = <T>(testcase: T | T[]): T[] => {
  return Array.isArray(testcase) ? testcase : [testcase];
};

export const mergeResults = (
  firstReport: CIRawReport,
  secondReport: CIRawReport
): CIRawReport => {
  const first = flat(flat(firstReport.testsuites.testsuite.testcase));
  const second = flat(flat(secondReport.testsuites.testsuite.testcase));
  if (!first.length || !second.length) return firstReport;

  const secondLabels = new Set<string>(second.map(t => t.name));
  const firstToKeep = first.filter(t => !secondLabels.has(t.name));

  return {
    testsuites: {
      testsuite: {
        testcase: [...second, ...firstToKeep],
        failures: '0',
        errors: '0',
      },
    },
  };
};

export const CIReport = class CIReport {
  readonly reportPath: string;
  rawReport: CIRawReport;
  constructor(reportPath: string) {
    this.reportPath = reportPath;

    this.rawReport = parser.toJson(fs.readFileSync(reportPath).toString(), {
      object: true,
    }) as CIRawReport; // XXX
  }

  get passCount() {
    if (!this.rawReport.testsuites.testsuite.testcase) return 0;
    return flat(this.rawReport.testsuites.testsuite.testcase).filter(t => {
      return !t.failure;
    }).length;
  }

  get failedCount() {
    if (!this.rawReport.testsuites.testsuite.testcase) return 0;
    return flat(this.rawReport.testsuites.testsuite.testcase).filter(t => {
      return t.failure;
    }).length;
  }

  notifyNewReport(newReport: CIReport) {
    const testcase = mergeResults(this.rawReport, newReport.rawReport);
    this.rawReport.testsuites.testsuite.testcase =
      testcase.testsuites.testsuite.testcase;
    this.rawReport.testsuites.testsuite.failures = `${this.failedCount}`;
    this.rawReport.testsuites.testsuite.errors = `${this.failedCount}`;
  }

  write() {
    this.writeTo(this.reportPath);
  }

  writeTo(reportPath: string) {
    fs.writeFileSync(
      reportPath,
      parser.toXml(this.rawReport, {sanitize: true})
    );
  }
};
