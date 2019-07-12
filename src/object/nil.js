(function() {
  // @DOC: A "nil" object allows for chainable property behaviors that amount to a noop.

  const nil = Object.create(null);
  Object.defineProperty(global, 'nil', {
    get: () => nil
  });

  Object.setPrototypeOf(
    nil,
    new Proxy(
      {},
      {
        get: (target, name, ctx) => {
          switch (name.toString()) {
            case 'Symbol(Symbol.toStringTag)':
              return () => 'NIL';
            case 'Symbol(util.inspect.custom)':
              return () => 'NIL';
            case 'Symbol(Symbol.toPrimitive)':
              return () => '';
            case 'hasOwnProperty':
              return () => false;
            case 'toString':
              return () => '';
            case 'constructor':
              return nil;
            case 'length':
              return 0;
            case 'isa':
              return () => 'nil';
            case 'ea':
              return () => nil;
            case 'or':
              return any => any;
          }

          if (!Reflect.has(target, name)) {
            return nil;
          }

          return Reflect.get(target, name, ctx);
        },
        set: (/* target, name, value, ctx */) => {
          return nil;
        }
      }
    )
  );
})();
