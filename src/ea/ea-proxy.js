const eaProxyTraps = {
  get: (self, key) => {
    if (key === 'isProxy') return true;

    // @NOTE: We don't have to prioritize local properties over eaProxies definitions. We _could_ offer a .get()
    // interface for accessing these dictionary-esque entries.
    if (self[key] !== undefined) {
      return self[key];
    }

    // @NOTE: this only works for enumerable properties
    // @TODO: Use the extKB structure to map non-enumerable props
    if (Standard.features.hasOwnProperty(key)) {
      // @TODO: use a custom .bind() that preserves toString of functions
      // @CONSIDER: We might want to ea(self) here, but it threw errors so investigate
      return Standard.features[key].bind(self);
    }

    return nil;
  }
};

// @TODO: Move this to Standard.proxy
// @TODO: Move tests associated with eaProxy to object/standard-test.js
global.eaProxy = obj => {
  return new Proxy(obj, eaProxyTraps);
};

// @TODO: Create a Standard.deepProxy() that implements this:
  // @REF: https://stackoverflow.com/questions/43177855/how-to-create-a-deep-proxy
  // @NOTE: useful for diffing objects, creating reactive views from string templates, and efficient delta save
  // techniques for large objects.
  // @NOTE: Adhere to property definitions of non-writable/non-configurable properties
  // @REF: https://stackoverflow.com/a/48495509

// @TODO: Extend on Standard.deepProxy() to create versioned objects that can diff / patch
  // @REF: https://stackoverflow.com/questions/40497262/how-to-version-control-an-object/40498130#40498130
