const { extractConfigJson, writeConfigJson } = require('./htmlReportJsParser');
const { mergeResults } = require('./mergeResults');

module.exports.JSONReport = class JSONReport {
  constructor(reportPath) {
    this.reportPath = reportPath;

    this.rawReport = extractConfigJson(reportPath);
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

  write() {
    this.writeTo(this.reportPath);
  }

  writeTo(reportPath) {
    writeConfigJson(reportPath, this.rawReport);
  }
}