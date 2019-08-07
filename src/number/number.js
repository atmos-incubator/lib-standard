(function() {
  Object.assign(Standard.features, {
    isNumeric: function() {
      const v = this.valueOf();
      if (isa(v, 'number')) return true;
      if (typeof v === 'object') return false;
      return Number(parseFloat(v)) == v;
    },
    toFloat: function() {
      return parseFloat(this.valueOf());
    }
  });
  Object.protoMap(Number.prototype, {
    duration: function(unit) {
      unit = unit || 'ms';
      const units = ['ms', 's', 'm', 'h', 'd', 'y'];
      const threshold = units.indexOf(unit);

      if (threshold === -1) {
        throw new Error(
          'Number.duration() expects first parameter to be one of the following: ' +
            units.wrap('"').join(', ')
        );
      }

      const parts = [];
      const divs = [
        null,
        () => parts.push(Math.floor(parts[0] / 1000)), // s
        () => parts.push(Math.floor(parts[1] / 60)), // m
        () => parts.push(Math.floor(parts[2] / 60)), // h
        () => parts.push(Math.floor(parts[3] / 24)), // d
        () => parts.push(Math.floor(parts[4] / 365)) // y
      ];
      const mods = [
        null,
        () => (parts[0] = Math.floor(parts[0] % 1000)),
        () => (parts[1] = Math.floor(parts[1] % 60)),
        () => (parts[2] = Math.floor(parts[2] % 60)),
        () => (parts[3] = Math.floor(parts[3] % 24)),
        () => (parts[4] = Math.floor(parts[4] % 365))
      ];

      // push 0's for units below our threshold
      threshold.ea(() => parts.push(0));

      // push this value
      parts.push(this.valueOf());

      // process each entry to determine the remainder
      units.length.ea(i => {
        if (i <= threshold) return;
        divs[i].try();
        mods[i].try();
      });

      // label the segments
      let i = 0;
      const nextUnit = units.clone().reverse();
      const segments = parts
        .reverse()
        .ea('toString')()
        .ea('suffix')(v => nextUnit[i++]);

      // create return structure
      const res = {
        parts,
        // @TODO: if res was a proxy we could intercept the real toString call and auto-translate this value on concatenation
        toString: () =>
          segments
            .ea(v => (v.startsWith('0') ? undefined : v))
            .or(['0s'])
            .join(' '),
        full: segments
      };

      // add individual units to result
      segments.ea((v, k) => {
        res[nextUnit[k]] = v;
      });

      return res;
    },

    between: function(min, max) {
      return this.valueOf() >= min && this.valueOf() <= max;
    }
  });
})();
