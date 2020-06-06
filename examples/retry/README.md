This endpoint returns random emoji from three emojis(😀, 😇, 😝).
Each try may fail, but retrying failed tests will pass all test.
- https://blog.sushi.money/random_face

```
$ npm install -g backstopjs
$ backstop reference
$ npx backstop-retry-failed-scenarios --retry 5 --command "backstop test"
```
