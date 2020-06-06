const { mergeResults } = require('../lib/mergeResults');

test('it returns object', () => {
  expect(mergeResults({}, {})).toStrictEqual({});
});

test('it replaces old failed test with new successful test', () => {
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
        status: 'success',
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
        status: 'success',
      }
    ]
  });
});