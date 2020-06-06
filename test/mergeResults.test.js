const { mergeResults } = require('../lib/mergeResults');

test('it returns object', () => {
  expect(mergeResults({}, {})).toStrictEqual({});
});

test('it replaces old failed test with new passed test', () => {
  expect(mergeResults({
    testSuite: 'BackstopJS',
    id: 'backstop_default',
    tests: [
      {
        pair: {
          label: 'a',
          viewportLabel: 'phone',
        },
        status: 'fail',
      },
      {
        pair: {
          label: 'a',
          viewportLabel: 'tablet',
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
          viewportLabel: 'phone',
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
          viewportLabel: 'phone',
        },
        status: 'pass',
      },
      {
        pair: {
          label: 'a',
          viewportLabel: 'tablet',
        },
        status: 'fail',
      }
    ]
  });
});