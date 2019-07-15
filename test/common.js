global.sinon = require('sinon');
global.sandbox = sinon.createSandbox();
afterEach(() => sandbox.restore());

// @DOC: Flag used to skip stack trace tests (and possibly others)
global.workingSourceMaps = true;
