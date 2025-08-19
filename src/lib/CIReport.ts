import fs from 'fs';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

import { CIRawReport } from './Types';

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

export class CIReport {
  readonly reportPath: string;
  rawReport: CIRawReport;
  private xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    alwaysCreateTextNode: false,
    parseAttributeValue: false,
    parseTagValue: false,
  });
  private xmlBuilder = new XMLBuilder({
    format: true,
    ignoreAttributes: false,
    attributeNamePrefix: '',
    suppressBooleanAttributes: false,
  });

  constructor(reportPath: string) {
    this.reportPath = reportPath;

    this.rawReport = this.xmlParser.parse(
      fs.readFileSync(reportPath).toString()
    ) as CIRawReport;
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
    fs.writeFileSync(reportPath, this.xmlBuilder.build(this.rawReport));
  }
}
