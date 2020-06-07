import {mergeResults} from '../lib/mergeResults';

test('it returns object', () => {
  expect(mergeResults({tests: []}, {tests: []})).toStrictEqual({tests: []});
});

test('it replaces old failed test with new passed test', () => {
  expect(
    mergeResults(
      {
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
          },
        ],
      },
      {
        tests: [
          {
            pair: {
              label: 'a',
              viewportLabel: 'phone',
            },
            status: 'pass',
          },
        ],
      }
    )
  ).toStrictEqual({
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
      },
    ],
  });
});
