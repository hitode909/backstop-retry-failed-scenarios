import escapeStringRegexp from 'escape-string-regexp';
import {JSONRawReport} from './Types';

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
    .map(label => escapeStringRegexp(label)
      .replaceAll('/', '\\/')
      .replaceAll("'", '.')) // cannot escape single quotes in shell, but since it's a RegExp a dot is fine, worst thing that can happen is that it matches more than it should
    .join('|')})$`;
};
