(function() {
  const main = () => {
    // @VAR: nil - An object that represents and behaves like `null` but allows for chainable property behaviors that amount to a noop.
    // @SEE: undef
    genNoopProxy(null, 'NIL', 'nil');

    // @VAR: undef - An object that represents and behaves like `undefined` but allows for chainable property behaviors that amount to a noop.
    // @SEE: nil
    genNoopProxy(undefined, 'UNDEF', 'undef');

    // @NOTE: `nil` and `undef` simulate null and undefined, but they evaluate to truthy.  Use `nil.or()` or `nil.valueOf()` for falsey evaluation.
  };

  const genNoopProxy = (raw, symbol, str) => {
    const p = new Proxy(
      {},
      {
        get: (target, name, ctx) => {
          switch (name.toString()) {
            case 'Symbol(Symbol.toStringTag)':
              return () => symbol;
            case 'Symbol(util.inspect.custom)':
              return () => symbol;
            case 'Symbol(Symbol.toPrimitive)':
              return () => '';
            case 'hasOwnProperty':
              return () => false;
            case 'toString':
              return () => '';
            case 'valueOf':
              return () => raw;
            case 'constructor':
              return undefined;
            case 'length':
              return 0;
            case 'isa':
              return () => str;
            case 'ea':
              return () => ctx;
            case 'or':
              return any => any;
          }

          if (!Reflect.has(target, name)) {
            return ctx;
          }

          return Reflect.get(target, name, ctx);
        },

        set: (target, name, value, ctx) => {
          return ctx;
        }
      }
    );

    Object.defineProperty(global, str, { get: () => p });
  };

  return main();
})();
