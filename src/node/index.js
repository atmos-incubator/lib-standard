// @NOTE: https://github.com/bitinn/node-fetch/blob/HEAD/LIMITS.md
// istanbul ignore next because this only runs in test:web
if (typeof document === 'undefined') {
  eval("require('./sha.js')"); // eslint-disable-line
}

// istanbul ignore else because only one side is ever invoked
if (global.isNode) {
  eval("global.fetch = require('node-fetch')"); // eslint-disable-line
}
