/**
 *
 * @param {Object} first
 * @param {Object} second
 * @returns {Object} merged object
 */
const mergeResults = (first, second) => {
  if (!first.tests || !second.tests) return first;

  const newTests = first.tests.map(oldResult => {
    if (oldResult.status === 'pass') return oldResult;
    const newResult = second.tests.find(test => test.label === oldResult.label);
    return newResult || oldResult;
  });
  return {
    ...first,
    tests: newTests,
  };
};

module.exports.mergeResults = mergeResults;