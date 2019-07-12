(function() {
  const AP = [Array.prototype];

  Object.proto(AP, 'removeVal', function(any) {
    var idx = this.indexOf(any);

    if (idx >= 0) {
      this.splice(idx, 1);
    }

    return this;
  });

  Object.proto(AP, 'unshiftUpdate', function(any) {
    this.removeVal(any);
    this.unshift(any);
    return this;
  });

  Object.proto(AP, 'pushUpdate', function(any) {
    this.removeVal(any);
    this.push(any);
    return this;
  });

  Object.proto(AP, 'pushOnce', function(any) {
    if (this.indexOf(any) === -1) {
      this.push(any);
      return true;
    }
  });

  Object.proto(AP, 'flatten', function flattener() {
    // convert an array of nested arrays into a single array object with sub-arrays placed in-series
    var r = [];
    this.ea(
      v =>
        (r = r.concat(
          'array collection arguments'.includes(isa(v)) ? flattener.call(v) : v
        ))
    );
    return r;
  });

  Object.proto(AP, 'after', function(any) {
    return this.indexOf(any) !== -1
      ? this.slice(this.indexOf(any) + 1)
      : undefined;
  });

  Object.proto(AP, 'afterIdx', function(any) {
    assert(isa(any, 'number'));
    return this.slice(any + 1);
  });

  Object.proto(AP, 'random', function(cnt) {
    // returns N random values from an array

    var a = this.valueOf();
    var res = (cnt || 1).ea(function(i) {
      return a[Math.random(0, a.length - 1)];
    });

    // for implicit single random item
    if (cnt == undefined) {
      return res[0];
    }

    return res;
  });

  Object.proto(AP, 'last', function(n) {
    if (n != null) {
      return this.slice(this.length - n);
    } else {
      return this[this.length - 1];
    }
  });

  Object.proto(AP, 'prune', function() {
    // removes empty/whitespace only values in this array
    return this.ea(function(v) {
      const val = def(v, '')
        .toString()
        .trim();
      if (val.length) return val;
    });
  });
})();
