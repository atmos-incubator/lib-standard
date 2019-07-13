(function(global, window) {
  // @DOC: Lib Standard - a prototype extension library for modern JavaScript development

  /* istanbul ignore next when in server mode */
  if (window) {
    // Normalize global access between window and global
    window.global = window;
  }

  // @VAR: noop() - no-operation callback handler
  global.noop = function(any) {
    return any;
  };

  // @VAR: guid() - A uuid/v4 generator
  global.guid = () => require('uuid/v4')();

  // @SECTION: lib/standard features - see each <directory>/readme.md for detailed documentation

  require('./interact');
  require('./assert');
  require('./object');
  require('./ea');
  require('./clone');
  require('./error');
  require('./array');
  require('./string');
  require('./event');
  require('./date');
  require('./math');

  // Allow scalar prototypes to be applied to each index of an array
  Object.proto.toArray(String.prototype);
  Object.proto.toArray(Number.prototype);
  Object.proto.toArray(Date.prototype);

  // @SECTION: Support for basic lifecycle event subscriptions.

  // @VAR: onInit - invokes all subscribers after lib/standard is initialized
  global.onInit = Event.queue(true); // Invoked as soon as the framework is ready
  // @VAR: onLoad - invokes all subscribers after dom ready or onInit depending on browser context.
  global.onLoad = Event.queue(true); // Invoked on DOM Ready
  // @VAR: onUnload - invoked from onBeforeUnload when available or onExit otherwise.
  global.onUnload = Event.queue(true); // Invoked from onBeforeUnload when available
  // @VAR: onExit - invoked just before the application exits
  global.onExit = Event.queue(true); // Invoked just before exit
  // @VAR: onDie - invoked just before a die() invocation
  global.onDie = Event.queue(true); // Invoked just before a die() spiral

  setImmediate(() => global.onInit());

  /* istanbul ignore next because only one side is ever invoked */
  if (typeof document !== 'undefined') {
    // load window/dom extensions
    require('./window');
  } else {
    setImmediate(() => global.onLoad());
    process.on('exit', code => {
      global.onUnload();
      global.onExit();
    });
  }
})(
  /* istanbul ignore next */
  typeof global !== 'undefined' ? global : null,
  /* istanbul ignore next */
  typeof window !== 'undefined' ? window : null
);
