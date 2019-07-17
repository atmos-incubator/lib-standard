// load lib/standard
require('../src/bootstrap.js');

// Setup our mocha environment
require('./common.js');

// @TODO: get source maps to work properly in Mocha Web Test Harness.
global.workingSourceMaps = false;

// @NOTE: Use webpack to require all tests
var context = require.context('../src', true, /.+-(test|test-web)\.js$/);
context.keys().forEach(context);

after(() => {
  // Post the results back to web-dev-server for backend reporting
  fetch('/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pass: find('li.passes em').innerText,
      fail: find('li.failures em').innerText,
      dur: find('li.duration em').innerText
    })
  })
    .then(res => res.text())
    .then(res => {
      if (res === 'close') {
        open(location, '_self').close();
      }
    });
});
