const { mergeResults } = require('../lib/mergeResults');

test('it returns object', () => {
  expect(mergeResults({}, {})).toStrictEqual({});
});

test('it replaces old failed test with new passful test', () => {
  expect(mergeResults({
    testSuite: 'BackstopJS',
    id: 'backstop_default',
    tests: [
      {
        pair: {
          label: 'a',
        },
        status: 'fail',
      }
    ]
  }, {
    testSuite: 'BackstopJS',
    id: 'backstop_default',
    tests: [
      {
        pair: {
          label: 'a',
        },
        status: 'pass',
      }
    ]
  })).toStrictEqual({
    testSuite: 'BackstopJS',
    id: 'backstop_default',
    tests: [
      {
        pair: {
          label: 'a',
        },
        status: 'pass',
      }
    ]
  });
});