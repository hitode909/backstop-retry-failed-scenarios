const fs = require('fs');
const parser = require('xml2json');

const mergeResults = (first, second) => {
  return first.testsuites.testsuite.testcase.map(t => {
    if (!t.failure) return t;
    const newResult = second.testsuites.testsuite.testcase.find(t => {
      return !t.failure;
    });
    return newResult || t;
  });
}

module.exports.CIReport = class CIReport {
  constructor(reportPath) {
    this.reportPath = reportPath;

    this.rawReport = parser.toJson(fs.readFileSync(reportPath).toString(), { object: true });
  }

  get passCount() {
    if (!this.rawReport.testsuites.testsuite.testcase) return 0;
    return this.rawReport.testsuites.testsuite.testcase.filter(t => { return ! t.failure }).length;
  }

  get failedCount() {
    if (!this.rawReport.testsuites.testsuite.testcase) return 0;
    return this.rawReport.testsuites.testsuite.testcase.filter(t => { return t.failure }).length;
  }

  notifyNewReport(newReport) {
    const testcase = mergeResults(this.rawReport, newReport.rawReport)
    this.rawReport.testsuites.testsuite.testcase = testcase;
    this.rawReport.testsuites.testsuite.failures = this.failedCount;
    this.rawReport.testsuites.testsuite.errors = this.failedCount;
  }

  write() {
    this.writeTo(this.reportPath);
  }

  writeTo(reportPath) {
    fs.writeFileSync(reportPath, parser.toXml(this.rawReport));
  }
}