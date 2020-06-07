type JSONCase = {
  pair: {
    label: string;
    viewportLabel: string;
  };
  status: string;
};
export type JSONRawReport = {
  tests: JSONCase[];
};

type CICase = {
  failure: boolean;
};

export type CIRawReport = {
  testsuites: {
    testsuite: {
      testcase: CICase[];
      failures: number;
      errors: number;
    };
  };
};

