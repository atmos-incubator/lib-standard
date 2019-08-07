(function() {
  Object.protoMap(Function.prototype, {
    subclass: function(scope, fn) {
      var orig = this;

      if (!fn) {
        fn = scope;
        scope = null;
      }

      // Prevent recursive subclassing
      // @TODO: This should operate on a hidden subclassId = guid() property to prevent two similarly written closures from reporting false positive match.
      if (this.toString() == fn.toString()) {
        return this;
      }

      var res = function() {
        // Pass original function into subclass
        var args = [orig, arguments, scope];
        return fn.apply(this, args);
      };

      // @TODO: test to see if this allows post-binding
      res = res.bind(scope || orig);

      // Supply a more informative toString()
      // @NOTE: without this fn.bind() returns "[native code]" and unbound returns the res closure above
      res.toString = function() {
        // @TODO: Provide an indicator that this function was subclassed that doesn't affect the serialization of the function
        return fn.toString();
      };

      // provide 'super' access
      res.parent = orig;

      return res;
    },

    curry: function(args) {
      // return a scoped function that has prepopulated arguments
      var self = this;

      return function() {
        return self.apply(self, args.concat(ea(arguments)));
      };
    },

    try: function(...args) {
      try {
        const result = this.apply(this, args);
        return {
          result,
          catch: () => result
        };
      } catch (e) {
        return {
          error: e,
          catch: fn => {
            fn(e);
          }
        };
      }
    },

    onPause: function(dur) {
      // Executes this function after a delay of `dur` only if this function isn't called again.  Useful for keypress events where
      // you want an action to occur after the user pauses typing
      // @EG: elem.on('keypress', () => queryServer.onPause(500));
      var k = this.id();

      if (pauses.has(k)) {
        clearTimeout(pauses[k].timer);
      } else {
        pauses[k] = {};
      }

      // ignore dur in arguments to apply to function
      var args = ea(arguments).after(1);

      pauses[k].timer = setTimeout(() => {
        this.apply(this, args);
      }, dur);

      return this;
    },

    id: function() {
      // Returns an identifier for a function
      return (this.name || 'anonymous') + ':' + this.guid();
    },
    guid: function() {
      return sha(this.source());
    },
    source: function() {
      // @NOTE: This prevents varying whitespace from affecting function identification across stacks.
      return this.toString().trim(); // .replace(/\s/g, '');
    }
  });

  var pauses = ea({});
})();
