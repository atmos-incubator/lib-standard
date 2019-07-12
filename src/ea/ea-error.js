(function() {
  Object.protoMap(Error.prototype, {
    // Enhance Error objects
    handle: function(handler) {
      // attempt to handle errors
      // will return a value if the error was intended to return a value (ea iterator)
      // will rethrow the error if it was unhandled
      // will pass error into handler if supplied whenever a throw would occur.
      const finish = () => {
        if (handler) {
          return handler(this);
        } else {
          throw this.valueOf();
        }
      };

      if (has(this, 'die')) {
        finish();
      }

      if (has(this, 'ignore')) {
        return this.response;
      }

      if (this.checkBubble()) {
        return this.response;
      }

      if (this.checkDebug()) return;

      finish();
    },
    checkBubble: function() {
      // allows for bubbling up nested iterators
      if (this.bubble) {
        this.count--;
        if (this.count <= 0) {
          return true;
        }
        throw this.valueOf();
      }
    },
    checkDebug: function(bool) {
      if (has(this, 'debug')) {
        // allows for auditing logic flow and selectively binding to a debugger
        if (this.extra) {
          log('DEBUG: ' + this.extra);
        }
        if (bool || global.debug.on) {
          // eslint-disable-next-line no-debugger
          debugger;
        }
        return true;
      }
    }
  });
})();
