(function() {
  Object.proto(String.prototype, 'escapeJSON', function() {
    // Escape this string for JSON evaluation
    return this.replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t')
      .replace(/\0/g, '\\0')
      .replace(/\r/g, '\\r');
  });

  Object.assign(Standard.features, {
    stringify: function(maxDepth, offset, depth, scalar) {
      // @DOC: creates a visually formatted json-esque serialization of any JavaScript object, including functions and
      // dates. It also preserves `String('foo')` and `Number(42)`. `maxDepth` controls how deep to recurse with -1
      // (default) being infinite.
      // @TODO: Extract these internal params from arguments object as local vars to clarify that they are not public interfacing
      // @TODO: Check for a fourth `recurse` param === true (and pass it in as such) to throw an error when recurse is undefined and arguments exist after arguments[1]
      // @NOTE: `offset`, `depth` and `scalar` are internal params used by the recursion algorithm.
      var data = this;

      offset = def(offset, '');
      depth = def(depth, 0);
      maxDepth = def(maxDepth, -1);

      if (depth > maxDepth && maxDepth != -1) {
        return '';
      }

      var nextOff = offset + '  ';
      var nextDepth = depth + 1;
      var array = [];

      switch (isa(data)) {
        case 'string':
          if (!scalar) {
            return 'new String("' + data.escapeJSON() + '")';
          }
          return '"' + data.escapeJSON() + '"';
        case 'number':
          return data;
        case 'boolean':
          return data.valueOf() ? 'true' : 'false';
        case 'date':
          return 'new Date(' + data.valueOf() + ')';
        case 'function':
        case 'regexp':
          return data.toString();
        case 'object':
        default:
          ea(data, function(v, k) {
            try {
              var val = isa(v, null)
                ? v.valueOf()
                : ea(v).stringify(
                    maxDepth,
                    nextOff,
                    nextDepth,
                    v.toString() === v
                  );
            } catch (e) {
              val = '"[UNQUERYABLE OBJECT]"';
            }

            k = '"' + k.toString().escapeJSON() + '"';
            array.push(k + ': ' + val);
          });

          if (array.length == 1 && !array[0].match(/[\n{[]/)) {
            return '{ ' + array[0] + ' }';
          }

          return (
            '{\r\n' +
            nextOff +
            array.join(',\r\n' + nextOff) +
            '\r\n' +
            offset +
            '}'
          );

        case 'array':
          ea(data, v => {
            try {
              array.push(
                isa(v, null)
                  ? v.valueOf() + ''
                  : v.stringify(
                      maxDepth,
                      nextOff,
                      nextDepth,
                      v.toString() === v
                    )
              );
            } catch (e) {
              // @NOTE: This is applicable to COM objects only
              array.push('"[UNQUERYABLE OBJECT]"');
            }
          });

          return (
            '[\r\n' +
            nextOff +
            array.join(',\r\n' + nextOff) +
            '\r\n' +
            offset +
            ']'
          );
      }

      // @LICENSE: Original approach influenced with some inspiration from Matt Kruse
      //
      // Copyright (c)2005-2009 Matt Kruse (javascripttoolbox.com)
      //
      // Dual licensed under the MIT and GPL licenses. This basically means you can use this code however you want for
      // free, but don't claim to have written it yourself! Donations always accepted:
      // http://www.JavascriptToolbox.com/donate/
    },

    clone: function(merge) {
      // creates a value copy of an object
      var res = ea(this)
        .stringify()
        .parse();

      if (merge) {
        return ea(res).merge(merge);
      }

      return ea(res);
    },
    parse: function() {
      return this.valueOf();
    }
  });

  Object.proto(String.prototype, 'parse', function(silent) {
    // @DOC: Convert this string into a JS variable
    var res;

    const clearVar = id => {
      // @NOTE: This fixes a bug in the global/window proxy in mocha:jsdom environments
      global[id] = undefined;
      delete global[id];
      return id;
    };

    if (this.length) {
      // @TODO: Extract into utility function
      const tmpId = clearVar('a' + guid().split('-')[0]);
      try {
        const evil = eval;
        evil('global["' + tmpId + '"] = ' + this.valueOf() + ';');
      } catch (e) {
        res = e.handle(e => !silent && e.toss());
      }
      res = res || global[tmpId];
      clearVar(tmpId);
    }

    return res;
  });
})();
