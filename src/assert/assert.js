(function() {
  // @DOC: Assertion extensions that make for easier testing

  global.assert = require('assert');

  // @CONSIDER: Should assert(nil) throw?

  // @DOC: `assert.equal()` should imply strict equality. So it is remapped to `assert.equiv()` to imply `==`
  // equivalence, and supplanted with `assert.strictEqual` for brevity sake.
  // @NOTE: This patch is generally safe because `assert.equal()` has been deprecated.
  // @REF: https://nodejs.org/api/assert.html#assert_assert_equal_actual_expected_message
  global.assert.equiv = global.assert.equal;
  global.assert.equal = (v1, v2) => {
    assert.strictEqual(v1, v2);
  };
  global.assert.equals = global.assert.equal;
  global.assert.notEquiv = global.assert.notEqual;
  global.assert.notEqual = (v1, v2) => {
    assert.ok(v1 !== v2);
  };

  // @DOC: Async helper that invokes callback if predicate is ok.
  global.assert.async = (b, fn) => {
    assert.ok(b);
    fn();
  };
  global.assert.asyncBad = (b, fn) => {
    assert.bad(b);
    fn();
  };

  global.assert.bad = b => {
    assert.ok(!b || isa(b, 'error'));
  };

  // @DOC: Improved namespace for deep* assertions
  global.assert.identical = global.assert.deepStrictEqual;
  global.assert.different = global.assert.notDeepStrictEqual;
  global.assert.similar = global.assert.deepEqual;
  global.assert.divergent = (v1, v2) => {
    assert.similar(v1, v2);
    assert.notDeepStrictEqual(v1, v2);
  };

  global.assert.includes = (v1, v2) => {
    assert.ok(ea(v1).includes(v2));
  };

  // @DOC: `assert.count(n?)` allows for easy call-count verification without the use of spies. `assert.count()`
  // increments a counter and `assert.count(4)` asserts that the internal counter matches 4.
  var total = 0;
  global.assert.count = n => {
    if (n !== undefined) {
      const tmp = total;
      total = 0;
      assert.equal(tmp, n);
      return true;
    } else {
      total++;
    }
    return total;
  };

  global.assert.truth = b => {
    assert.strictEqual(b, true);
  };
})();
