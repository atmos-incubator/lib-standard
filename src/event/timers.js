(function() {
  const timers = {
    setInterval: [],
    setTimeout: []
  };

  const refMap = {
    clearTimeout: timers.setTimeout,
    clearInterval: timers.setInterval
  };

  const enhancedTimer = function(type) {
    // Enhanced timers allow for the following features:
    // @: Calls made with the same fn are automatically cleared before a new timer is set.
    // @: Arguments passed in after the timer are curried to the callback.
    // @: Standard Errors are handled internally
    return function(orig, args) {
      let fn = args[0];

      const ofn = fn;
      if (ofn.tid) {
        // @NOTE: browsers do not like calling clearTimeout/Interval by alias
        if (type == 'setTimeout') clearTimeout(ofn.tid);
        if (type == 'setInterval') clearInterval(ofn.tid);
      }

      const ms = args[1] || 1;

      args = ea(args).afterIdx(1);

      // Execute (code) in a global context every `ms`;
      if (!fn || isa(fn, 'string')) {
        throw new Error(type + ' expects first argument to be a function');
      }

      fn = fn.curry(args);

      const tid = orig(function() {
        try {
          fn();

          if (type == 'setTimeout') {
            // cleanup the tracker
            timers[type].removeVal(ofn.tid);
          }
        } catch (e) {
          if (!e.ignore) {
            error('enhancedTimer: ' + type + ' error: ' + e + ' : ' + e.exit);
            throw e;
          }
        }
      }, ms);

      Object.defineProperty(ofn, 'tid', {
        enumerable: false,
        configurable: true,
        get: () => tid
      });

      timers[type].pushOnce(ofn.tid);

      return tid;
    };
  };

  ea(timers, (refs, k) => {
    // Overwrite setTimeout / setInterval
    global[k] = global[k].subclass(enhancedTimer(k));
  });

  ['clearTimeout', 'clearInterval'].ea(k => {
    // create clearTimeout / clearInterval subclass that removes the internal ref
    global[k] = global[k].subclass((orig, args) => {
      // refMap[k].removeVal(args[0]);
      orig(args[0]);
    });

    // create clearTimeouts / clearIntervals helpers
    global[k.pluralize()] = () => {
      // @NOTE: because clearTimeout removes indexes from the refMap[k] this ensures iteration over each item.
      refMap[k].length.ea(idx => {
        global[k](refMap[k][idx]);
      });
    };
  });

  global.clearTimers = () => {
    // Helper to clear all registered timers
    // @NOTE: This is redundant in reality, but leaving both for future-proofing.
    clearTimeouts();
    clearIntervals();
  };
})();
