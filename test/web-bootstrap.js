// load lib/standard
require('../src/bootstrap.js');

// Setup our mocha environment
require('./common.js');

// @TODO: get source maps to work properly in Mocha Web Test Harness.
global.workingSourceMaps = false;

// @NOTE: Use webpack to require all tests
var context = require.context('../src', true, /.+-(test|test-web)\.js$/);
context.keys().forEach(context);
