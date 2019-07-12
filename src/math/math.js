(function() {
  // @TODO: Object.protoConst(Math, 'DREVIL', 1000000);
  Math.DREVIL = 1000000; // 1 Million Dollars!

  (function(o) {
    // Extend Math.random for usability
    Math.random = function(min, max) {
      // Produces a random number between the range (min) and (max) inclusive
      // default: min = 0, max = 1
      if (max != null) {
        return Math.floor(o() * (max - min + 1)) + min;
      } else {
        return o();
      }
    };
  })(Math.random);
})();
