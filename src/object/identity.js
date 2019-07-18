(function() {
  Object.getPrototypeRef = any => {
    // @NOTE: getPrototypeOf cannot handle nulls
    if (isa(any, null)) return;
    return Object.getPrototypeOf(any);
  };

  Object.getConstructor = any => {
    return !isa(any, null) ? any.constructor : undefined;
  };

  Object.getConstructorType = any => {
    // @DOC: return a moniker representing the type of constructor used to create `any`

    // @NOTE: getPrototypeOf cannot handle these
    if (any === null) return 'null';
    if (any === undefined) return 'undefined';
    if (any === nil) return 'nil';
    if (any === undef) return 'undef';

    // @NOTE: This normalizes 'window vs object' difference across stacks
    if (any === global) return 'object';

    return Object.getConstructor(any).name.toLowerCase();
  };

  Object.assign(Standard.features, {
    isa: function(any) {
      return isa(this.valueOf(), any);
    },
    eq: function(any) {
      return this === any || this === any.toObject();
    },
    keys: function() {
      return Object.keys(this);
    }
  });

  global.isa = function(any, str) {
    // @DOC: returns the identity of {any} or compares the identity with a descriptor {str}
    if (str === undefined) {
      return Object.getConstructorType(any);
    } else {
      switch (str) {
        // @NOTE: nil qualifies as both null and undef just as `null == undefined`
        case null:
        case 'null':
        case 'nil':
        case 'undefined':
        case 'undef':
          return any == null || any === nil || any === undef;
        case 'prototype':
          return Object.isPrototype(any);
        case 'scalar':
          return 'object function'.includes(typeof any) === false;
        default:
          return Object.getConstructorType(any) == str;
      }
    }
  };

  global.def = function(...a) {
    // returns first defined parameter
    return ea(a, v => {
      if (!isa(v, null)) return ea.exit(v);
    }).or();
  };

  const hop = Object.prototype.hasOwnProperty;
  global.has = function(obj, key) {
    return isa(obj, null) ? false : hop.call(obj, key);
  };

  Object.isPrototype = function(obj) {
    // Returns true or false if obj is a prototype object
    if (!obj) return false;
    if (!obj.constructor) return false;
    return obj.constructor.prototype === obj;
  };

  Object.defineProperty(Function.prototype, 'isArrowFn', {
    value: function() {
      return this.toString()
        .split('{')[0]
        .includes('=>');
    },
    enumerable: false
  });
})();
