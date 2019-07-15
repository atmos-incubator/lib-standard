// load lib/standard
require('../src/bootstrap.js');

// Setup our mocha environment
require('./common.js');

// @NOTE: Use webpack to require all tests
var context = require.context('../src', true, /.+-(test|test-web)\.js$/);
context.keys().forEach(context);
