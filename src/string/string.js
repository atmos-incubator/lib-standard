(function() {
  global.SP = [String.prototype];

  Object.proto(SP, 'endsWith', function(s) {
    // @DOC: Returns true if {this} string ends with {s}
    if (typeof s.length === 'undefined') return undefined;
    return this.slice(-1 * s.length) == s;
  });

  Object.proto(SP, 'startsWith', function(s) {
    return this.indexOf(s) === 0;
  });

  Object.proto(SP, 'join', function() {
    return this.valueOf();
  });

  Object.proto(SP, 'lines', function() {
    if (this.indexOf('\r\n') > -1) {
      // @NOTE: String split with regex will eat up consecutive matches and so is not cross browser compat
      return this.split('\r\n');
    } else {
      return this.split('\n');
    }
  });

  Object.protoMap(SP, {
    after: function(any) {
      switch (isa(any)) {
        case 'number':
          return this.slice(Math.min(any + 1, this.length));
        case 'string':
          return this.includes(any)
            ? this.slice(this.indexOf(any) + any.length)
            : undefined;
        default:
          assert(false, 'Number or String expected for `after`');
      }
    },
    before: function(any) {
      switch (isa(any)) {
        case 'number':
          return this.slice(0, Math.min(any + 1, this.length));

        case 'string':
          return this.includes(any)
            ? this.slice(0, this.indexOf(any))
            : undefined;
        default:
          assert(false, 'Number or string expected for `before`');
      }
    },
    beforeLast: function(str) {
      var t = this.split(str);

      if (t.length == 1) return this.valueOf();

      t.pop();
      return t.join(str);
    },
    between: function(l, r) {
      return this.after(l).before(r);
    },
    ltrim: function(str = ' ') {
      return this.indexOf(str) === 0 ? this.after(str) : this.valueOf();
    },
    rtrim: function(chars) {
      chars = chars || '[\\s|\\0]';
      return this.replace(new RegExp(chars + '+$', 'g'), '');
    },
    prefix: function(str) {
      return str + this.valueOf();
    },
    suffix: function(str) {
      // @TODO: Can this be done universally? via fn.proto.valueOf()?
      if (isa(str, 'function')) str = str();
      return this.valueOf() + str;
    },
    toInt: function() {
      return parseInt(this.valueOf(), 10);
    }
  });

  Object.proto(String.prototype, 'tryval', function(report) {
    try {
      // @NOTE: Indirect calls to eval are safer because they cannot dynamically change the caller's scope.
      const evil = eval;
      return evil(this.valueOf());
    } catch (e) {
      if (report) {
        e.handle();
      }
    }
  });

  Object.proto(String.prototype, 'ssv', function() {
    // returns an array of whitespace separated values
    return this.split(/\s/g);
  });

  Object.proto(String.prototype, 'chars', function() {
    // returns an array of characters from this string
    return this.split('');
  });

  Object.proto(String.prototype, 'capitalize', function() {
    // Capitalizes the first letter of a word if it doesn't already contain capital letters.
    const string = this.trim();
    const word = string.ssv()[0];

    if (!word.match(/[A-Z]/)) {
      return string[0].toUpperCase() + string.from(1);
    }

    return string;
  });

  Object.proto(String.prototype, 'removeNewlines', function(replace) {
    // @NOTE: This was `/(\r\n)|(\r|\n)/g` but it didn't work as expected.
    return this.replace(/[\r\n]+/g, replace || ' ');
  });

  Object.proto(String.prototype, 'wrap', function(str, str2) {
    // Wraps a string `this` with copies of str or sandwiches between str & str2
    if (str.isa('array')) {
      str2 = str[1];
      str = str[0];
    } else if (str2 === undefined) {
      if (str.length == 2 && '[{(<"\'*_-'.includes(str[0])) {
        str2 = str[1];
        str = str[0];
      } else {
        str2 = str;
      }
    }

    return str + this + str2;
  });

  Object.proto(String.prototype, 'without', function(any) {
    // return a string without any string parts found in object {o}
    var res = this.valueOf();
    any.ea(function(v) {
      res = res.split(v).join('');
    });
    return res;
  });

  Object.proto(String.prototype, 'from', function(v) {
    // @DOC: returns a part of the string from either the numerical index of v or if v is a string from the first
    // matching position of the string
    if (!v) return this.valueOf();

    if (v.isa('number')) {
      return this.substr(v);
    }

    var pos = this.indexOf(v);
    if (pos >= 0) {
      return this.substr(pos);
    }

    return '';
  });

  Object.proto(String.prototype, 'dasherize', function() {
    return (
      // turn snake_case into snake-case
      this.replace(RegExp.punctuation, ' ')
        // turn camelCased into a camel-cased
        .replace(RegExp.capitals, ' $1')
        .toLowerCase()
        .words()
        .join('-')
    );
  });
})();
