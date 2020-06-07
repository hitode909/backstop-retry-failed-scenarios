type Case = {
  pair: {
    label: string;
    viewportLabel: string;
  };
  status: string;
};
export type JSONRawReport = {
  tests: Case[];
};
