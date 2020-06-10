import {JSONRawReport} from './Types';

export const mergeResults = (
  first: JSONRawReport,
  second: JSONRawReport
): JSONRawReport => {
  if (!first.tests || !second.tests) return first;

  const secondLabels = new Set<string>(second.tests.map(t => t.pair.label));
  const firstToKeep = first.tests.filter(t => !secondLabels.has(t.pair.label));

  return {
    ...first,
    // new test first
    tests: [...second.tests, ...firstToKeep],
  };
};
