(function() {
  // @TODO: Object.protoConst(Math, 'DREVIL', 1000000);
  Math.DREVIL = 1000000; // 1 Million Dollars!

  (function(o) {
    // Extend Math.random for usability
    Math.random = function(min, max) {
      // Produces a random number between the range (min) and (max) inclusive
      // default: min = 0, max = 1
      // If only min is provided, Number.MAX_SAFE_INTEGER is assumed for max
      if (!isa(max, null)) {
        return Math.floor(o() * (max - min + 1)) + min;
      } else if (!isa(min, null)) {
        return Math.random(min, Number.MAX_SAFE_INTEGER);
      } else {
        return o();
      }
    };
  })(Math.random);
})();
