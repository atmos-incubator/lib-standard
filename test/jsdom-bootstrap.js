require('./common.js');
const jsdom = require('mocha-jsdom');

// @NOTE: This is a hack designed to load jsdom before bootstrapping lib standard.
// @TODO: Submit a pull request to mocha-jsdom to offer a custom "before" handler as an option parameter
global.before = fn => {
  fn(() => {
    // @NOTE: This handles the mocha test environment where a global _and_ a window (jsdom) exist.
    // @NOTE: it doesn't handle `delete global.prop` because the proxy exists on the global prototype instead of global
    // itself. Proxying global itself is not possible. This bug only affects hybrid mocha-jsdom environments.
    Object.setPrototypeOf(
      global,
      new Proxy(
        {},
        {
          get: (target, key) => {
            // make properties on window really global
            return target[key] || window[key];
          },
          set: (target, key, value) => {
            // keep window in sync
            target[key] = value;
            window[key] = value;
          }
        }
      )
    );
    require('../src/bootstrap.js');
    // @NOTE: because jsdom is already loaded, the usual onload event hooks never fire in the bootstrap.
    onLoad();
  });
};

after(() => {
  // @NOTE: jsdom doesn't have onbeforeunload / onclose functionality yet.
  // @REF: https://github.com/jsdom/jsdom/issues/1584
  onUnload();
});

jsdom({
  // @NOTE: This fixes a security error thrown by jsdom about localStorage permissions
  url: 'http://localhost/',
  // @NOTE: This isn't necessary because of the proxied global prototype
  globalize: false
});

describe('Mocha JSDOM Environment', () => {
  it('Feels like a real window', () => {
    // in the JSDOM environment window and global are not the same object, but they feel like it.
    assert.notEqual(window, global);

    // @NOTE: They don't work with `delete` operator on `global`
    window.fff = true;
    delete global.fff;
    assert(global.fff);
    assert(window.fff);

    // @NOTE: They do work on the real `window` object
    delete window.fff;
    assert.bad(window.fff);
    assert.bad(global.fff);

    // @NOTE: But globals can be manually cleaned up in tests through assignment to undefined.
    global.fff = true;
    assert(window.fff);
    global.fff = undefined;
    assert.bad(window.fff);
  });
});
