(function() {
  Object.assign(Standard.features, {
    toArray: function() {
      // @DOC: Converts `arguments` into an array.
      return [].slice.apply(this);
    },

    sort: function() {
      // @DOC: returns a new object with sorted property keys
      const keys = Object.keys(this.valueOf());
      const ordered = {};
      keys.sort();
      keys.map(key => {
        ordered[key] = this[key];
      });
      return ea(ordered);
    },

    includes: function(any) {
      return Object.values(this).includes(any);
    },

    toObject: function() {
      return this;
    }
  });
})();
