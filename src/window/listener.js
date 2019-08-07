module.exports = win => {
  const protos = ea({
    // various event targets, most fall under the Node prototype
    // @NOTE: AudioNode, AudioContext, and others might fall outside of this Node.proto chain
    // @NOTE: MDN reports there are other `EventTarget` interfaces, but these were all I could find
    node: win.Node.prototype,
    window: win,
    xhr: win.XMLHttpRequest.prototype
  });
  protos.ea(function(proto) {
    // @DOC: addEventListener and removeEventListener are patched on the window, dom node, and xmlhttprequest objects
    // for runtime reflection and proper closure cleanup on partial DOM removal and window unload()
    // istanbul ignore if
    if (!proto || !proto.addEventListener || proto.addEventListener.patched) {
      return;
    }

    (function(ael, rel) {
      proto.addEventListener = function(e, f, b) {
        // @TODO: let e == "click:#selector" to implement "live" events.  Wrap them in a handler that will only fire {f} when the evt.targetElement matches the #selector
        // @: only setup the "click" handler once, but merge "#selector" into the cb trigger check

        // track all events added to the dom, so we can flush them later and during innerHTML purges
        this.events = this.events || ea({});
        // @TODO: Need to implement an ordered object to match the real event spec.
        // this.events.ordered();

        // @TODO: the IE js debugger will call this with FunctionWrapper interface instead of Function
        // @: This may not be a problem for Edge, but leaving this here once I get to testing apps in-browser.
        // if (!f.id) return ael.call(this, e, f, b);

        // Mimic the behavior in addEventListener to avoid duplicate events
        var id = [e, f.id(), (b || false).toString()].join(':');

        if (this.events[e] && this.events[e][id]) {
          return id;
        }

        // Wrap function in try..catch for reporting
        var scope = this;
        var subFn = f.subclass(function(orig, args) {
          try {
            var res = orig.apply(scope, args);
          } catch (err) {
            if (!err.ignore) {
              error('in event ' + id + ': ' + err.message);
              throw err;
            }
          }
          return res;
        });
        subFn.id = function() {
          // make sure the id value that rel uses matches the original function not the subclass
          return f.id();
        };

        // Ordered object keeps execution sequence in order
        // this.events.pushUpdate(id, {
        this.events[id] = {
          type: e,
          id: id,
          func: f,
          capture: b,
          subFn: subFn
        };

        // Register event for programmatic inspection and el.proto.invoke() ability
        this.events[e] = this.events[e] || {};
        this.events[e][id] = true;

        // Call the real addEventListener
        ael.call(this, e, subFn, b);

        // @DOC: this `id` can be used to cancel an event via elem.removeEventListener(id);
        return id;
      };
      proto.addEventListener.patched = true;

      proto.removeEventListener = function(e, f, b) {
        const argLen = arguments.length;

        // Clean up tracking info for removed events
        if (this.has('events')) {
          // allow traditional removeEventListener params or just the event signature id
          if (argLen == 1 && isa(e, 'string')) {
            var id = e;
          } else {
            // @TODO: Determine if IE bug when console is opened still happens in Edge
            // if (!f.id) return rel.call(this, e, f, b);
            id = [e, f.id(), (b || false).toString()].join(':');
          }

          if (this.events.has(id)) {
            // parse event info
            var evt = this.events[id];

            rel.call(this, evt.type, evt.subFn, evt.capture || false);

            // Garbage collect the `events` object
            delete this.events[id];
            delete this.events[evt.type][id];
            // @TODO: check the performance on these keys generations during a document unload event
            if (Object.keys(this.events[evt.type]).length == 0) {
              delete this.events[evt.type];
            }
            if (Object.keys(this.events).length == 0) delete this.events;

            evt = null;
          }
        }
        return true;
      };
    })(proto.addEventListener, proto.removeEventListener);
  });

  Object.protoMap([win.Node.prototype], {
    on: function(event, fn, capture) {
      // @DOC: a feature-rich alternative to addEventListener
      // @TODO: add NodeList/HTMLCollection.proto.on that places the handler on the common parent, but then calls the handler with e.target as the scope

      var elem = this;

      // allow space separated event list
      if (isa(event, 'string') && event.includes(' ')) {
        event = event.split(' ');
      }

      // allow arrays of events to invoke the same function
      if (isa(event, 'array')) {
        return event.ea(name => elem.on(name, fn, capture));
      }

      // allow object to map individual events to separate functions
      if (isa(event, 'object')) {
        ea(event, (fn, name) => elem.on(name, fn, capture));
        return this;
      }

      // fn must exist
      if (!fn || !isa(fn, 'function')) {
        throw new Error(
          'Node.prototype.on(' +
            event +
            ') requires a function param for element ' +
            elem.info()
        );
      }

      // Keyboard events need a focusable element in order to work
      if (event.match(/^key/) && elem.focusable) {
        elem.focusable();
      }

      if (event == 'rightclick') {
        // @NOTE: Right click on an element scrollbar produces no e.target
        event = 'contextmenu';
      }

      if (event == 'init') {
        // This keeps init logic grouped with the definition of an element's behavior
        // @CONSIDER: use a proxy here for the simulated event instead of an object
        return fn.call(this, { simulated: true, type: 'init' });
      }

      // if (event == 'unload') {
      // @TODO: register an unload handler for the window, and check for this event when we .remove any element
      // Error.toss('Element on:unload is not implemented yet');
      // }

      // Finally add the event listener
      var res = elem.addEventListener(event, fn, capture);

      // pass eventId back to callback which can use off(closure.eventId) to disable
      if (!fn.eventIds) {
        Object.defineProperty(fn, 'eventIds', {
          value: []
        });
      }
      fn.eventIds.push(res);

      return res;
    },
    off: function(type) {
      this.removeAllEventListeners(type);
    },
    removeAllEventListeners: function(type) {
      // remove any and all attached event listeners
      var elem = this;

      // @TODO: reverse type when it's an alias/special property like rightclick => contextmenu

      if (elem.has('events')) {
        var events = elem.events;
        for (var e in events) {
          // istanbul ignore if
          if (!events.hasOwnProperty(e)) continue;

          var v = events[e];
          if (v && v.type) {
            if (!type || type == v.type) {
              elem.removeEventListener(v.type, v.subFn, v.capture);
            }
          }
        }
      }
    }
  });

  Object.defineProperty(win, 'on', {
    value: win.Node.prototype.on.bind(win)
  });

  Object.defineProperty(win, 'off', {
    value: win.Node.prototype.off.bind(win)
  });

  Object.defineProperty(win, 'removeAllEventListeners', {
    value: win.Node.prototype.removeAllEventListeners.bind(win)
  });

  // @TODO: Implement el.proto.invoke
};
