require('./nil.js');
require('./standard.js');

// @FIX: webpack will complain about missing fs/path modules when compiling for client.
// istanbul ignore else
if (global.isNode) {
  eval("require('./standard-client.js')"); // eslint-disable-line
}
require('./identity.js');
require('./proto.js');
require('./object.js');
