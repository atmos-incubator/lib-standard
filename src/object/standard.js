(function() {
  // @DOC: Used to standardize object access across node / browser regardless of global.VERBOTEN state.
  function Standard() {}

  // @TODO: When a Standard.feature is defined, auto define a global property that auto-converts global invocations of
  // Standard.features functions with the correct binding and toString() patches.

  // Make the constructor a global const
  Object.defineProperty(global, 'Standard', {
    get: () => Standard,
    set: () => {
      throw new Error('Standard object is read-only');
    },
    enumerable: true
  });

  Object.defineProperty(Standard, 'features', {
    value: new Proxy(
      {},
      {
        get: (target, key) => {
          return target[key];
        },
        set: (target, key, value) => {
          // register this feature
          target[key] = value;

          // apply it to all Standard.protos
          for (const proto of Standard.protos) {
            // @TODO: use Object.proto here
            proto[key] = proto[key] || value;
          }

          // proxies expect true on success
          return true;
        }
      }
    ),
    configurable: false,
    writable: false
  });

  Object.defineProperty(Standard, 'protos', {
    value: new Proxy(
      [
        Array.prototype,
        Number.prototype,
        BigInt.prototype,
        String.prototype,
        Boolean.prototype,
        Date.prototype,
        RegExp.prototype,
        Function.prototype
      ],
      {
        get: (target, key) => {
          if (key === 'push') {
            return any => {
              if (isa(any, 'array')) {
                target.splice(-1, 0, ...any);
                for (const proto of any) {
                  Object.protoMap(proto, Standard.features);
                }
              } else {
                target.push(any);
                Object.protoMap(any, Standard.features);
              }
            };
          }

          return target[key];
        }
      }
    ),
    writable: false,
    configurable: false
  });

  global.Standard.ize = function(prop, fn) {
    // if `prop` is a prototype, then include it in the list of standard prototypes
    if (Object.isPrototype(prop)) {
      return Standard.protos.push(prop);
    }

    if (isa(prop, 'array')) {
      // @NOTE: Standard.protos.push accepts arrays
      return Standard.protos.push(prop);
    }

    // If `prop` && `fn` then apply it to all prototypes registered for standardization
    if (isa(prop, 'string') && isa(fn, 'function')) {
      Object.proto.checkArrow(fn, Standard.protos, prop);
      Standard.features[prop] = fn;
    }

    // if `prop` is an object merge the features
    if (isa(prop, 'object')) {
      for (const [key, value] of Object.entries(prop)) {
        assert.bad(
          Standard.features[key],
          `Namespace Conflict: Standard feature ${key} already exists`
        );
        Standard.features[key] = value;
      }
    }
  };
})();
