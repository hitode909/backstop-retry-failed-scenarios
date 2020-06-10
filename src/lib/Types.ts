export type JSONCase = {
  pair: {
    label: string;
    viewportLabel: string;
    fileName: string;
  };
  status: 'pass' | 'fail';
};
export type JSONRawReport = {
  tests: JSONCase[];
};

export type CICase = {
  name: string;
  classname: string;
  failure: boolean;
};

export type CIRawReport = {
  testsuites: {
    testsuite: {
      testcase: CICase[] | CICase;
      failures: string;
      errors: string;
    };
  };
};
