(function() {
  var extKB = Object.create(null);

  /* istanbul ignore next @TODO: implement real object prototype extensions parity and invoke a second npm test with flag set to true */
  var defaultProtos = [global.VERBOTEN ? Object.prototype : Standard.features];

  // @TODO: generate associated helpers for scalar-based extensions.
  // @: for String.prototype mods, default an Array.prototype mod for `{str}Any`, `{str}All` etc that applies logic to each entry

  Object.proto = (protoArr, str, fn) => {
    // @DOC: Define a function property on the given list of prototype instances
    // @DOC: protoArr defaults to `[Standard.prototype]`;
    // @REF: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

    if (typeof protoArr == 'string') {
      fn = str;
      str = protoArr;
      protoArr = defaultProtos;
    }

    if (!isa(protoArr, 'array')) {
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
        enumerable: false
      });

      switch (protoArr[i]) {
        case String.prototype:
        case Number.prototype:
          Object.proto.parlay(protoArr[i], Array.prototype, str);
        // eslint-disable-next-line
        case String.prototype:
          Object.proto.parlay(protoArr[i], Number.prototype, str);
        // eslint-disable-next-line
        case Number.prototype:
          Object.proto.parlay(protoArr[i], String.prototype, str);
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

  Object.proto.fnKeys = proto => {
    // @NOTE: Patching these properties will cause issues, so we block them.
    var ignores =
      'toJSON valueOf toString toLocaleString toPrimitive constructor';
    return ea(Object.getOwnPropertyNames(proto), v => {
      if (!ignores.includes(v) && isa(proto[v], 'function')) {
        return v;
      }
    });
  };

  Object.proto.parlay = (sourceProto, targetProto, property) => {
    // @DOC: This transfers all functions (or just `property`) from the source to target prototypes.
    var ignores = Object.proto.fnKeys(targetProto);

    // @TODO: targetProto === Object.prototype ? { <property>Val: () => ea(prop), <property>Key: () => ea(prop) }
    var handler =
      targetProto === Array.prototype
        ? key =>
            function(...args) {
              return this.ea(v => {
                // @NOTE: Coerce the value into a type the prototype extension can handle.
                return isa(v, null)
                  ? null
                  : sourceProto[key].apply(sourceProto.constructor(v), args);
              });
            }
        : key =>
            function(...args) {
              // @NOTE: Coerce the value into a type the prototype extension can handle.
              return targetProto.constructor(
                sourceProto[key].apply(sourceProto.constructor(this), args)
              );
            };

    if (property) {
      if (ignores.includes(property)) return;
      return Object.proto.prop(targetProto, property, handler(property));
    }

    ea(Object.proto.fnKeys(sourceProto), key => {
      // Don't overwrite existing Array.prototype functions
      if (ignores.includes(key)) return;
      Object.proto.prop(targetProto, key, handler(key));
    });
  };

  Object.proto.prop = (proto, key, fn, force) => {
    // require force parameter to overwrite existing property
    if (proto[key] && !force) return;

    Object.defineProperty(proto, key, {
      // @TODO: provide a custom toString() for easier debugging
      value: fn,
      writable: true,
      enumerable: false
    });
  };

  // @TODO: Object.protoPoly({}) that protoMap's kvp's for multiple types: "number/string/object"
  // @: polymorphic prototype extensions
})();
