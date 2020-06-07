import fs from 'fs';
import parser from 'xml2json';

import {CIRawReport} from './Types';

const flat = <T>(testcase: T | T[]): T[] => {
  return Array.isArray(testcase) ? testcase : [testcase];
};

export const mergeResults = (
  first: CIRawReport,
  second: CIRawReport
): CIRawReport => {
  const newTestCases = flat(first.testsuites.testsuite.testcase).map(t1 => {
    if (!t1.failure) return t1;
    const newResult = flat(second.testsuites.testsuite.testcase).find(t2 => {
      return t1.name === t2.name && t1.classname === t2.classname;
    });
    return newResult || t1;
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
