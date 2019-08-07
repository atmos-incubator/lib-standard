(function() {
  Object.assign(Standard.features, {

    toArray: function() {
      // Converts normal objects into array of tuples
      return ea(this.valueOf(), (v, k) => [k, v]);
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
    },

    slice: function(keys) {
      return ea(this, (v, k) => {
        if (keys.includes(k)) {
          ea.merge(k, v);
        }
      });
    }

  });
})();
