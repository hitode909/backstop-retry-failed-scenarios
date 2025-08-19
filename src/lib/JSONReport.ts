import { extractConfigJson, writeConfigJson } from './htmlReportJsParser';
import { mergeResults } from './mergeResults';
import { JSONRawReport } from './Types';

export class JSONReport {
  reportPath: string;
  rawReport: JSONRawReport;
  constructor(reportPath: string) {
    this.reportPath = reportPath;

    this.rawReport = extractConfigJson(reportPath);
  }

  get passCount() {
    return this.rawReport.tests.filter(t => t.status === 'pass').length;
  }

  get failedCount() {
    return this.rawReport.tests.filter(t => t.status === 'fail').length;
  }

  notifyNewReport(newReport: JSONReport) {
    this.rawReport = mergeResults(this.rawReport, newReport.rawReport);
  }

  write() {
    this.writeTo(this.reportPath);
  }

  writeTo(reportPath: string) {
    writeConfigJson(reportPath, this.rawReport, undefined, undefined);
  }
}
