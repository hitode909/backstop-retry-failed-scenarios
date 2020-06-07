import {JSONRawReport} from './Types';

export const mergeResults = (
  first: JSONRawReport,
  second: JSONRawReport
): JSONRawReport => {
  if (!first.tests || !second.tests) return first;

  const newTests = first.tests.map(oldResult => {
    if (oldResult.status === 'pass') return oldResult;
    const newResult = second.tests.find(test => {
      return (
        test.pair.label === oldResult.pair.label &&
        test.pair.viewportLabel === oldResult.pair.viewportLabel &&
        test.status === 'pass'
      );
    });
    return newResult || oldResult;
  });
  return {
    ...first,
    tests: newTests,
  };
};
