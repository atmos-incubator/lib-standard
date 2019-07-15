(function() {
  Object.getPrototypeRef = any => {
    // @NOTE: getPrototypeOf cannot handle these
    if (any == null) return;
    if (any == nil) return nil;
    return Object.getPrototypeOf(any);
  };

  Object.getConstructor = any => {
    return any != null ? any.constructor : undefined;
  };

  Object.getConstructorType = any => {
    // @DOC: return a moniker representing the type of constructor used to create `any`

    // @NOTE: getPrototypeOf cannot handle these
    if (any === null) return 'null';
    if (any === undefined) return 'undefined';
    if (any === nil) return 'nil';

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
    // @TODO: allow for 'scalar' and 'prototype' values for {str} param and remove Object.isScalar/isPrototype
    // @DOC: returns or compares the constructor identity of an object
    if (str == undefined) {
      return Object.getConstructorType(any);
    } else {
      return Object.getConstructorType(any) == str;
    }
  };

  global.isScalar = function(any) {
    // returns true if {any} or {this} is not an object
    return 'object function'.includes(typeof any) === false;
  };

  global.def = function(...a) {
    // returns first defined parameter
    return ea(a, v => {
      if (v != null && v !== nil) return ea.exit(v);
    }).or();
  };

  const hop = Object.prototype.hasOwnProperty;
  global.has = function(obj, key) {
    return obj != null && hop.call(obj, key);
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
