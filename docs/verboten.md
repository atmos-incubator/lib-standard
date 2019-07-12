# Verboten Mode

`lib/standard` offers a "verboten" mode where functionality is attached to the native `Object.prototype` instead of via proxy objects produced by `ea()`.  This mode offers better performance and reduced `ea()` boilerplate without losing compatibility with code written for proxied versions of this lib.

## Considerations

When using this mode, you should be aware of these considerations:

1. `for..in` loops on objects need a `hasOwnProperty` check

1. Checking for properties should be done with `is()` or `has()`.

    1. Alternatively you can create non-prototyped objects via `Object.create(null)`

1. Properties you define on an object will mask prototype extension functions.  So you should generally use nouns for properties to avoid shadowing with `lib/standard`'s verb-based functions.
