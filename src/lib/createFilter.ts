import escapeStringRegexp from 'escape-string-regexp';
import { JSONRawReport } from './Types';

/**
 *
 * @returns {(String|null)} filter string for failed tests
 */
export const createFilter = (report: JSONRawReport): string | null => {
  if (!report.tests) return null;

  const failedTestLabels = [
    ...new Set(
      report.tests.filter(t => t.status === 'fail').map(t => t.pair.label)
    ),
  ];
  if (failedTestLabels.length === 0) return null;
  return `^(${failedTestLabels
    .map(label => escapeStringRegexp(label))
    .join('|')})$`;
};
