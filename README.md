# backstop-retry-failed-scenarios

A wrapper script to retry failed scenario for BackstopJS.
It parses report.json, extract failed tests, and rerun with `--filter` option, and rewrite result file.
This is useful when your tests are unstable.

```
$ backstop reference
$ backstop-retry-failed-scenarios --command 'backstop test' --retry 5 --config backstop.js
```

## TODO

- [x] implement merge method
- [ ] implement cli
- [ ] support merging results
  - [ ] HTML
  - [ ] JSON
  - [ ] CI