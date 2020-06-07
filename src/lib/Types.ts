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
  name: string;
  classname: string;
  failure: boolean;
};

export type CIRawReport = {
  testsuites: {
    testsuite: {
      testcase: CICase[] | CICase;
      failures: number;
      errors: number;
    };
  };
};

