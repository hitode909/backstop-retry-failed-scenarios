# backstop-retry-failed-scenarios

A wrapper command to retry failed scenario for [BackstopJS](https://github.com/garris/BackstopJS).<br>
It parses report.json, extract failed tests, and rerun with `--filter` option, and rewrite result file.<br>
This is useful when your tests are unstable.

# FEATURES
- Invoke specified test command
- Generate filter option from failed tests
- Reorganize each failed reports to latest one status
  - Supports HTML report, JSON report, CI report.

## EXAMPLE

This endpoint returns random emoji from three emojis(😀, 😇, 😝).<br>
Each try may fail, but retrying failed tests will pass all test.
- https://blog.sushi.money/random_face

```
$ cd examples/retry
$ backstop reference
$ npx backstop-retry-failed-scenarios
```

![examples/retry/images/try.gif](examples/retry/images/try.gif)


## HOW TO RUN
Instead of `backstop test`, run `backstop-retry-failed-scenarios` and set command, retry count, config path.

```
$ npm install -g backstop backstop-retry-failed-scenarios
$ backstop init
$ backstop reference
$ backstop-retry-failed-scenarios --retry 5 --command 'backstop test' --config backstop.js
```


Instead of npm install, you can pull [hitode909/backstop-retry-failed-scenarios](https://hub.docker.com/repository/docker/hitode909/backstop-retry-failed-scenarios) from DockerHub.<br>
Its image is based on [backstopjs/backstopjs](https://hub.docker.com/r/backstopjs/backstopjs), so you can execute backstop directly from `docker run hitode909/backstop-retry-failed-scenarios`.

```
$ docker pull hitode909/backstop-retry-failed-scenarios
$ docker run --rm -v $(pwd):/src hitode909/backstop-retry-failed-scenarios backstop init
$ docker run --rm -v $(pwd):/src hitode909/backstop-retry-failed-scenarios backstop reference
$ docker run --rm -v $(pwd):/src hitode909/backstop-retry-failed-scenarios backstop-retry-failed-scenarios
```

If you want to recreate references every time, Please set `--reference-command` option. This will do like this.
1. create all references
2. run all tests
3. create references for failed tests on 2.
4. run tests for failed tests on 2.

This is useful when your reference refers to production instead static file, and test refers to staging environment.

```
$ backstop init
$ backstop-retry-failed-scenarios --reference-command 'backstop reference' --command 'backstop test' --config backstop.js
```

## OPTIONS

```
  --retry             number Retry count. default: 3
  --config            string Path to config file. default: backstop.json
  --command           string Command to run test. default: backstop test
  --reference-command string Command to create reference before testing. Default: null (Do not create reference before test).
  --output-profile    string Path to profiler output file. If present, measure the execution time and output the report as JSON.
```