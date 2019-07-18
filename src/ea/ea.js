(function() {
  // @DOC: ea() uses es6 proxies to manage property lookup and chaining without affecting the typeof / prototype chain
  // of the wrapped object.

  // @NOTE: This feature is fugly - but designed for performance. Abstraction of logic to closures creates too much
  // overhead for such a fundamental construct. Modifications that improve readability without sacrificing performance
  // `npm run perf` are encouraged.

  // @NOTE: Allows unique identification of this ea implementation
  const eaFnId = Symbol('eaFn');

  const main = () => {
    Standard.features.ea.eaFnId = eaFnId;
  };

  Object.assign(Standard.features, {
    ea: function(fn, asyncFn, concurrent) {
      var data = this.valueOf();

      if (typeof fn == 'string' && data !== global) {
        // @NOTE: Allows for this: [].ea('slice')(1, 3); to call slice(1, 3) on all elements of []
        return function() {
          var args = arguments;
          return data.ea(function(v, k) {
            return v[fn].apply(v, args);
          });
        };
      }

      var i = 0; // counter for {fn} params
      var ary = []; // used to return array of results (default behavior)
      var obj; // used when iteration throws Error.merge exception (see ea.merge())
      var stop = false; // used to make remaining concurrent callbacks no-ops
      const is = isa(data);
      var idx = 0; // used for numerical iteration
      var count = 0; // num completed async callback events
      const removes = []; // used to prune lists while iterating over them without messing up the iteration index

      if (!isa(fn, 'function')) {
        fn = noop;
      }

      concurrent = concurrent || 1;

      if (asyncFn) {
        if (asyncFn === true) {
          asyncFn = noop;
        }
        // Prep the iteration strategy for numerical this values
        if (is == 'number') {
          var keys = null;
          var total = data;
        } else {
          keys = is == 'array' ? data.clone() : Object.keys(data);
          total = keys.length;
        }

        if (!total) {
          // optimizer
          return asyncFn([]);
        }
      }

      try {
        var skip = 0;

        var iteration = asyncFn
          ? function(key, val) {
              // Asynchronous Iterator

              if (stop) return;

              try {
                val = val !== undefined ? val : data[key];

                const handler = function(res) {
                  count++;

                  // @TODO: implement skip handling for async operations
                  // if (skip && skip--) return;
                  if (stop) {
                    return;
                  }

                  if (res !== undefined) ary.push(res);

                  if (count == total) {
                    stop = true;
                    asyncFn(ary);
                  } else {
                    // keep it rolling at specified concurrency
                    if (concurrent == 1 || count % concurrent == 1) {
                      for (var i = 0; i < concurrent; i++) {
                        if (is == 'number') {
                          iteration(idx++, idx);
                        } else if (keys.length) {
                          iteration(keys.shift());
                        }
                      }
                    }
                  }
                };

                handler.exit = exitRes => {
                  stop = true;
                  asyncFn(exitRes);
                  ea.exit(exitRes);
                };

                // @TODO: handler.merge
                // @TODO: handler.join
                // @TODO: handler.skip
                // @TODO: handler.remove

                fn.call(
                  data,
                  // Asynchronous Iterator, passes an iteration flow handler as first param to {fn}
                  handler,
                  // params passed into callback
                  ea(val),
                  key,
                  i++,
                  ary
                );
              } catch (e) {
                // for the small chance an error throws before the internal async operation occurs.
                if (stop != true) {
                  stop = true;
                  e.async = true;
                  var exitRes = e.handle();
                  asyncFn(exitRes !== undefined ? exitRes : ary);
                  throw e;
                }
              }
            }
          : function(key, val) {
              // Synchronous Iterator

              if (skip && skip--) return;

              try {
                // @NOTE: val check handles number enumeration, which lacks the concept of keys
                val = val !== undefined ? val : data[key];

                var res = fn.call(data, ea(val), key, i++, ary);

                // @TODO: make ea.def(o) handle an object with mergeRight flag
                // @TODO: make ea.def(a) handle an array with pushOnce logic
                // @TODO: make ea.concat(a) combine arrays

                // @TODO: Allow ea.undef() and ea.exit.undef() to include undefined values in the result so that map
                // operations are compatible with
                if (res !== undefined) ary.push(res);
              } catch (e) {
                if (e.merge === true) {
                  // use of e.merge() triggers response object return
                  obj = obj !== undefined ? obj : ea({});

                  // support ea.exit(k, v) and ea.exit({ k: v });
                  if (e.k) {
                    obj[e.k] = e.v;
                  } else {
                    if (e.right) {
                      Object.assign(obj, e.response);
                    } else {
                      obj = Object.assign(e.response, obj);
                    }
                  }
                } else if (e.join === true) {
                  // allow for inline array flattening
                  ary = ary.concat(e.response);
                } else if (e.exit) {
                  if (e.response !== undefined) {
                    obj = e.response;
                  }
                  throw e;
                } else if (e.remove === true) {
                  removes.push(e.key);
                } else if (e.skip) {
                  skip = e.skip;
                } else {
                  e.handle();
                }
              }
            };

        // handle various data types appropriately.
        if (!asyncFn) {
          var x;

          if (is == 'number') {
            for (x = 0; x < data; x++) {
              iteration(x, x);
            }
          } else if (
            is == 'array' ||
            (data.length > 0 && data.hasOwnProperty(0))
          ) {
            // handles arrays and array-like objects (call arguments, dom node attributes)
            for (x = 0; x < data.length; x++) {
              iteration(x);
            }
          } else {
            for (x in data) {
              if (data.hasOwnProperty(x)) {
                iteration(x);
              }
            }
          }

          // remove items after iteration to prevent corruption of live list indexes
          if (removes.length) {
            var offset = 0;
            for (x = 0; x < removes.length; x++) {
              if (is == 'array') {
                data.splice(removes[x] - offset, 1);
                offset++;
              } else {
                delete data[removes[x]];
              }
            }
          }
        } else {
          // for async iterations, trigger the iterator which will run sequentially until no more work is left
          for (var ci = 0; ci < concurrent; ci++) {
            if (!keys && total) {
              iteration(idx++, idx);
            } else {
              iteration(keys.shift());
            }
          }

          // @TODO: return a Promise that gets resolved when asyncFn is called
          // @EG: ea(3, v => { noop(v); }, true).then(() => celebrate());
        }
      } catch (e) {
        // handle the variety of error types (they will be rethrown) otherwise e is the returned value means exit was
        // called with a specific value
        var exitRes = e.handle();
        return exitRes !== undefined ? ea(exitRes) : ary;
      }

      if (obj !== undefined) return ea(obj);

      return ary;
    },
    or: function(any) {
      // Allows for `ea(any).or(false)` to return false when nothing is found in the any.ea iteration
      // @TODO: Refactor ea() to return a very special [] that always .or()s to any when empty, but otherwise [].or(false) should be [];
      // @: This would allow for (3).ea(v => { if (v === 2) ea.exit([]); }).or(false) === [];
      if (isa(this, 'array') && this.length === 0) return any;
      if (isa(this, 'object') && Object.keys(this).length === 0) return any;
      return this.valueOf();
    },
    has: function(any) {
      return this.hasOwnProperty(any);
    },
    merge: function(any) {
      Object.assign(this, any);
      return this.valueOf();
    }
  });

  global.ea = function(obj, fn, asyncFn, concurrent) {
    // @DOC: `ea(obj, fn)` provides iteration on objects that may not be proxied or proto patched.

    // @NOTE: These checks are designed to improve performance of ea().  Adjust cautiously.
    if (obj === null) return nil;
    if (obj === undefined) return undef;

    const isProxy = obj.isProxy;
    const args = arguments.length;

    if (isProxy && args === 1) return obj;

    if (Object.isPrototype(obj)) {
      return Object.keys(obj).ea(
        (v, ...args) => {
          return fn.apply(obj, [v, ...args]);
        },
        asyncFn,
        concurrent
      );
    }

    // proxy the object if necessary
    if (
      !obj.isProxy &&
      typeof obj === 'object' &&
      (!obj.ea || obj.ea.eaFnId !== eaFnId)
    ) {
      obj = Standard.proxy(obj);
    }

    // just proxy don't iterate
    if (args == 1) {
      return obj;
    }

    // .ea() is safe now
    return obj.ea(fn, asyncFn, concurrent);
  };

  ea.exit = any => {
    // break this ea() loop and or just quit the execution of a script if (any) is supplied the iteration loop will only
    // return that value and not the cumulating array.
    var e = new Error();
    e.ignore = true;
    e.exit = true;
    e.response = any;
    throw e;
  };

  ea.exitIf = (cond, any) => {
    if (cond) ea.exit(any);
  };

  ea.bubble = function(n, response) {
    // @DOC: bubble is to 'ea' loops like how 'continue' is to 'for loops' - it will immediately exit the current ea
    // function iteration and continue at the parent function scope. Provide `n` to continue 2 or more functional scopes
    // just like a for-loop's continue keyword.
    var e = new Error();
    e.bubble = true;
    e.exit = response !== undefined;
    e.response = response;
    e.count = def(n, 1);

    throw e;
  };

  ea.skip = function(n) {
    var e = new Error();
    e.skip = def(n, 1);
    throw e;
  };

  ea.debug = function(msg) {
    var e = new Error('Debug Breakpoint');
    e.extra = msg;
    e.debug = true;
    throw e;
  };

  ea.remove = function(key) {
    var e = new Error();
    e.remove = true;
    e.key = key;
    e.ignore = true;
    throw e;
  };

  ea.join = function(a) {
    var e = new Error();
    e.ignore = true;
    e.join = true;
    e.response = a;
    throw e;
  };

  ea.merge = function(any, right) {
    var e = new Error();
    e.ignore = true;
    e.merge = true;

    // allow key value pairs to be passed in
    if (typeof any == 'string') {
      e.k = any;
      e.v = right;
    } else {
      e.response = any;
      e.right = right;
    }

    throw e;
  };

  main();
})();
