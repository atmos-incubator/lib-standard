describe('NIL / UNDEF Objects', () => {
  // @NOTE: This craziness is because describes are called before the mocha-jsdom `before` hook which sets up Lib
  // Standard. So this makes the target context dynamic when the it()'s execute.
  let target = null;
  let symbol = '';
  let key = '';

  const targets = [
    () => {
      target = nil;
      symbol = 'NIL';
      key = 'nil';
    },
    () => {
      target = undef;
      symbol = 'UNDEF';
      key = 'undef';
    }
  ];

  const main = () => {
    for (let i = 0; i < targets.length; i++) {
      unifiedTests();
    }
  };

  var unifiedTests = () => {
    it('Swaps unified target', () => {
      targets.pop()();
    });

    it('is equivalent to itself', () => {
      assert.equal(target.test, target);
    });

    it('reports uniquely to console', () => {
      assert.equal(target[Symbol.toStringTag](), symbol);
      assert.equal(target[Symbol.for('util.inspect.custom')](), symbol);
    });

    it('does not equal a string', () => {
      assert.notEqual(target, symbol);
      assert.equal(target.toString(), '');
    });

    it('allows any type of chaining', () => {
      assert.ok(target.test.asdf.qwer.zxcv);
    });

    it('allows concatenation with strings', () => {
      assert.equal(target.asdf + 'asdf', 'asdf');
    });

    it('allows addition with numbers', () => {
      assert.equal(target.asdf + 1, '1');
    });

    it('has no length', () => {
      assert.equal(target.length, 0);
    });

    it('can iterate', () => {
      assert.ok(target.ea(v => assert.fail('This should not execute: ' + v)));
    });

    it('can be inspected', () => {
      assert.equal(target.isa(), key);
      assert.equal(isa(target), key);
    });

    it('cannot be assigned to', () => {
      target.test = 'nope';
      assert.notEqual(target.test, 'nope');
    });

    it('cannot be overwritten', () => {
      // eslint-disable-next-line no-global-assign
      nil = 'nope';
      // eslint-disable-next-line no-global-assign
      undef = 'nope';
      global[key] = 'nope';
      assert.notEqual(nil, 'nope');
      assert.notEqual(undef, 'nope');
    });

    it('handles object prototype functions', () => {
      assert.equal(target.isPrototypeOf({}), false);
    });

    it('handles or() alternatives', () => {
      assert.equal(target.or(true), true);
    });

    it('obscures reflection', () => {
      assert.bad(target.hasOwnProperty('foo'));
    });

    it('offers a workaround falsey evaluation', () => {
      // @NOTE: Ecmascript spec does not support a falsey evaluation from this
      assert.ok(target);
      assert.bad(target.or(false));
    });

    it('Maths', () => {
      assert.equal(Math.max(target, 1), 1);
    });
  };

  main();
});
