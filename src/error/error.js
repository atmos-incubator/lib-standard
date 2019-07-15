(function() {
  global.die = (...msg) => {
    var die = new Error(msg.join('\r\n') || '[DIED]');
    die.die = true;
    throw die;
  };

  Object.proto(Error.prototype, 'die', function(extra) {
    // @DOC: Produce a stack trace as though it were from the caller function.
    error('\nERROR:', this.message, '\n\n');
    error(Error.getStack(2));
    error('');
    error('Details:');
    error('       #: ', this.errno);
    error('    Code: ', this.code);
    error('    Path: ', this.path);
    if (def(extra)) error('    Extra: ', extra);
    error('\n');
    die();
  });

  Error.getStack = (skip = 1) => {
    // @DOC: Returns a stacktrace formatted as though it were triggered {skip} calls before here.
    return new Error().stack
      .lines()
      .afterIdx(skip)
      .join('\n');
  };

  Object.proto([Error.prototype], 'toss', function(...extra) {
    this.extra = extra;
    throw this.valueOf();
  });

  Object.assign(Standard.features, {
    toss: function() {
      return this.valueOf();
    }
  });

  global.toss = (e, ...extra) => {
    // @NOTE: allows for tossing first-argument-error params which are null otherwise
    if (isa(e, 'error')) e.toss(extra);
    return e;
  };
})();
