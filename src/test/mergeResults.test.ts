import {mergeResults} from '../lib/mergeResults';

test('it returns object', () => {
  expect(mergeResults({tests: []}, {tests: []})).toStrictEqual({tests: []});
});

test('it replaces old failed test with new passed test. Replaced test comes to the head.', () => {
  expect(
    mergeResults(
      {
        tests: [
          {
            pair: {
              label: 'b',
              viewportLabel: 'tablet',
              fileName: 'a.png',
            },
            status: 'pass',
          },
          {
            pair: {
              label: 'a',
              viewportLabel: 'phone',
              fileName: 'a.png',
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
              fileName: 'a.png',
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
          fileName: 'a.png',
        },
        status: 'pass',
      },
      {
        pair: {
          label: 'b',
          viewportLabel: 'tablet',
          fileName: 'a.png',
        },
        status: 'pass',
      },
    ],
  });
});
