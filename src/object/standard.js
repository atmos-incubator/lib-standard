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

  const standardProxy = {
    get: (self, key) => {
      if (key === 'isProxy') return true;

      // @NOTE: We don't have to prioritize local properties over Standard feature definitions. We _could_ offer a
      // .get() interface for accessing these dictionary-esque entries.
      if (self[key] !== undefined) {
        return self[key];
      }

      if (Standard.features.hasOwnProperty(key)) {
        // @TODO: use a custom .bind() that preserves toString of functions
        return Standard.features[key].bind(self);
      }

      return undefined;
    }
  };

  Standard.proxy = obj => {
    return new Proxy(obj, standardProxy);
  };

// @TODO: Create a Standard.deepProxy() that implements this:
  // @REF: https://stackoverflow.com/questions/43177855/how-to-create-a-deep-proxy
  // @NOTE: useful for diffing objects, creating reactive views from string templates, and efficient delta save
  // techniques for large objects.
  // @NOTE: Adhere to property definitions of non-writable/non-configurable properties
  // @REF: https://stackoverflow.com/a/48495509

// @TODO: Extend on Standard.deepProxy() to create versioned objects that can diff / patch
  // @REF: https://stackoverflow.com/questions/40497262/how-to-version-control-an-object/40498130#40498130
})();
