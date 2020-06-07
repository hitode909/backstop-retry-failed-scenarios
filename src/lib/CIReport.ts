import fs from 'fs';
import parser from 'xml2json';

import {CIRawReport} from './Types';

export const mergeResults = (
  first: CIRawReport,
  second: CIRawReport
): CIRawReport => {
  const newTestCases = first.testsuites.testsuite.testcase.map(t => {
    if (!t.failure) return t;
    const newResult = second.testsuites.testsuite.testcase.find(t => {
      return !t.failure;
    });
    return newResult || t;
  });
  return {
    testsuites: {
      testsuite: {
        testcase: newTestCases,
        failures: 0,
        errors: 0,
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
    return this.rawReport.testsuites.testsuite.testcase.filter(t => {
      return !t.failure;
    }).length;
  }

  get failedCount() {
    if (!this.rawReport.testsuites.testsuite.testcase) return 0;
    return this.rawReport.testsuites.testsuite.testcase.filter(t => {
      return t.failure;
    }).length;
  }

  notifyNewReport(newReport: CIReport) {
    const testcase = mergeResults(this.rawReport, newReport.rawReport);
    this.rawReport.testsuites.testsuite.testcase =
      testcase.testsuites.testsuite.testcase;
    this.rawReport.testsuites.testsuite.failures = this.failedCount;
    this.rawReport.testsuites.testsuite.errors = this.failedCount;
  }

  write() {
    this.writeTo(this.reportPath);
  }

  writeTo(reportPath: string) {
    fs.writeFileSync(reportPath, parser.toXml(this.rawReport));
  }
};
