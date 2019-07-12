# Safe Mode

By default this project will not modify the Object.prototype namespace.  But the end result is achieved by wrapping objects with a Standard Object proxy.  This provides access to a suite of chainable functionality that makes code less buggy and easier to read, maintain, and test.

For projects without broken third-party dependencies, you can bootstrap the native object prototype extensions by declaring a global `VERBOTEN` boolean flag to `true`.  Doing this comes with [a few considerations that you can read about here](docs/verboten).
