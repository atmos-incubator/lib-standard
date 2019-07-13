(function() {
  var extKB = Object.create(null);

  /* istanbul ignore next @TODO: implement real object prototype extensions parity and invoke a second npm test with flag set to true */
  var defaultProtos = [global.VERBOTEN ? Object.prototype : Standard.features];

  // @TODO: generate associated helpers for scalar-based extensions.
  // @: for String.prototype mods, default an Array.prototype mod for `{str}Any`, `{str}All` etc that applies logic to each entry
  // @: for String.prototype mods, default a Number.prototype mod that converts `this.toString()` first

  Object.proto = (protoArr, str, fn) => {
    // @DOC: Define a function property on the given list of prototype instances
    // @DOC: protoArr defaults to `[Standard.prototype]`;
    // @REF: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

    if (typeof protoArr == 'string') {
      fn = str;
      str = protoArr;
      protoArr = defaultProtos;
    }

    if (!protoArr.length) {
      protoArr = [protoArr];
    }

    Object.proto.checkArrow(fn, protoArr, str);

    // define a new property on the prototype with no enumeration
    for (var i in protoArr) {
      if (!protoArr.hasOwnProperty(i)) continue;

      assert(
        protoArr[i] !== Object.prototype || global.VERBOTEN,
        'Cannot extend Object.prototype without global.VERBOTEN flag'
      );

      // track this customization for easier programmatic reflection of hidden properties
      var mapKey = protoArr[i].constructor.name;
      extKB[mapKey] = extKB[mapKey] || [];
      extKB[mapKey].push(str);

      // define non enumerable property
      Object.defineProperty(protoArr[i], str, {
        value: fn,
        writable: true,
        enumerable: protoArr[i] === Standard.prototype
      });

      // define an array-op property if not already defined
      if (protoArr[i] === String.prototype && !has(Array.prototype, str)) {
        Object.defineProperty(Array.prototype, str, {
          value: function(...args) {
            return this.ea(v => {
              return v != null ? fn.apply(String(v), args) : v;
            });
          },
          writable: true,
          enumerable: protoArr[i] === Standard.prototype
        });
      }
    }
  };

  Object.proto.checkArrow = (fn, protos, name) => {
    if (fn.isArrowFn()) {
      die(
        'Arrow functions are not allowed for prototype extensions:',
        protos.map(v => v.constructor.name),
        name,
        fn.toString()
      );
    }
  };

  Object.protoMap = (protoArr, map) => {
    // Allow the definition of multiple key value pairs {map} on the provided prototypes {protoArr}

    if (map === undefined) {
      map = protoArr;
      protoArr = defaultProtos;
    }

    if (!protoArr.length) {
      protoArr = [protoArr];
    }

    for (const proto of protoArr) {
      for (const [k, fn] of Object.entries(map)) {
        Object.proto(proto, k, fn);
      }
    }
  };

  Object.proto.toArray = proto => {
    // @DOC: Object.proto.array(String.prototype) allows for the application of all String prototype functions to the
    // Array prototype.
    // @EG: ['asdf ', 'qwer '].trim() returns ['asdf', 'qwer']

    // @NOTE: Patching these properties will cause issues, so we block them.
    var ignores = ['valueOf', 'toJSON'];

    ea(Object.getOwnPropertyNames(Array.prototype), v => {
      if (isa(Array.prototype[v], 'function')) {
        ignores.push(v);
      }
    });

    ea(Object.getOwnPropertyNames(proto), key => {
      // For every known function on that proto...
      if (!isa(proto[key], 'function')) return;

      // ...that isn't already defined on the destination.
      if (ignores.includes(key)) return;

      Object.proto(Array.prototype, key, function(...args) {
        return this.ea(v => {
          // @NOTE: The constructor coerces the value into a type the prototype extension can handle.
          return v != null ? proto[key].apply(proto.constructor(v), args) : v;
        });
      });
    });
  };

  // @TODO: Object.protoPoly({}) that protoMap's kvp's for multiple types: "number/string/object"
  // @: polymorphic prototype extensions
})();
