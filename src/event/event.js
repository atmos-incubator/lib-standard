(function() {
  // Normalize Event object in node environments
  /* istanbul ignore next */
  global.Event = global.Event || {};

  Event.queue = function(singleInvoke) {
    // This creates a LIFO-default handler queue. A series of functions that are called when the handler is invoked with
    // a non-function arguments. `singleInvoke` indicates the subscription will only ever be invoked once, and so
    // subsequent queuing will be invoked immediately. If a function is provided to the new subscription, it will be
    // queued along with the rest, otherwise.

    // @NOTE: Handler functions can use ea.exit/ea.skip to return a value or manipulate the execution chain.

    return new function() {
      var ready = false;

      // return a function that offers prepending to the queue and invoking the queue
      var res = fn => {
        // #return-first-arg

        var args = arguments;

        if (isa(fn, 'function')) {
          fn.stop = () => res.subscribers.removeVal(fn);

          // operate at the front of the stack for LIFO access #80/20
          res.subscribers.unshiftUpdate(fn);

          if (singleInvoke && ready) {
            fn.apply(fn, res.invokeArgs);
          }

          return fn;
        } else if (ready && singleInvoke) {
          // don't let single invokes get invoked multiple times.
          return;
        } else {
          res.invokeArgs = args;
          ready = true;
        }

        // invoke all subscribers in sequence
        return res.subscribers.ea(sub => {
          try {
            return sub.apply(sub, res.invokeArgs);
          } catch (e) {
            return e.handle(() => {
              error(
                'Error in event subscription invocation.',
                sub.toString(),
                e
              );
              throw e;
            });
          }
        });
      };

      res.subscribers = [];

      res.push = fn => {
        // @DOC: `Event.queue().push()` allows for appending a handler to the subscriber queue instead of the default
        // prepend behavior
        res.subscribers.push(fn);
        fn.stop = () => res.subscribers.removeVal(fn);

        if (singleInvoke && ready) {
          fn.apply(fn, res.invokeArgs);
        }

        return fn;
      };

      return res;
    }();
  };
})();
