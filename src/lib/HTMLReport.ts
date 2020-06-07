import {extractConfigJs, writeConfigJs} from './htmlReportJsParser';
import {createFilter} from './createFilter';
import {mergeResults} from './mergeResults';
import {JSONRawReport} from './Types';

export const HTMLReport = class HTMLReport {
  reportPath: string;
  rawReport: JSONRawReport;
  constructor(reportPath: string) {
    this.reportPath = reportPath;
    this.rawReport = extractConfigJs(this.reportPath);
  }

  get filter() {
    return createFilter(this.rawReport);
  }

  get passCount() {
    return this.rawReport.tests.filter(t => t.status === 'pass').length;
  }

  get failedCount() {
    return this.rawReport.tests.filter(t => t.status === 'fail').length;
  }

  notifyNewReport(newReport: HTMLReport) {
    this.rawReport = mergeResults(this.rawReport, newReport.rawReport);
  }

  write() {
    this.writeTo(this.reportPath);
  }

  writeTo(reportPath: string) {
    writeConfigJs(reportPath, this.rawReport);
  }
};
