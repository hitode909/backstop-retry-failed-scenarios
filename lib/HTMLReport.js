const { extractConfigJs } = require('./htmlReportJsParser');
const { createFilter } = require('./createFilter');
const { mergeResults } = require('./mergeResults');

module.exports.HTMLReport = class HTMLReport {
  constructor(reportPath) {
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

  notifyNewReport(newReport) {
    this.rawReport = mergeResults(this.rawReport, newReport.rawReport)
  }
}