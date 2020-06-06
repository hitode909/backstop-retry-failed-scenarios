const { createFilter } = require('../lib/createFilter');

test('it returns null for empty input', () => {
  expect(createFilter({})).toStrictEqual(null);
});

test('returns empty string when all tests succeed', () => {
  expect(createFilter({
    testSuite: 'BackstopJS',
    id: 'backstop_default',
    tests: [
      {
        pair: {
          label: 'a',
        },
        status: 'success',
      },
    ]
  })).toStrictEqual(null);
});


test('returns filter string from failed tests', () => {
  expect(createFilter({
    testSuite: 'BackstopJS',
    id: 'backstop_default',
    tests: [
      {
        pair: {
          label: 'a',
        },
        status: 'fail',
      },
      {
        pair: {
          label: 'b',
        },
        status: 'success',
      },
      {
        pair: {
          label: 'c',
        },
        status: 'fail',
      }
    ]
  })).toStrictEqual('^(a|c)$');
});
