describe('NIL Objects', () => {
  it('reports as nil to console', () => {
    assert.equal(nil[Symbol.toStringTag](), 'NIL');
    assert.equal(nil[Symbol.for('util.inspect.custom')](), 'NIL');
  });

  it('is equivalent to itself', () => {
    assert.equal(nil.test, nil);
  });

  it('does not equal "NIL"', () => {
    assert.notEqual(nil, 'NIL');
    assert.equal(nil.toString(), '');
  });

  it('allows any type of chaining', () => {
    assert.ok(nil.test.asdf.qwer.zxcv);
  });

  it('allows concatenation with strings', () => {
    assert.equal(nil.asdf + 'asdf', 'asdf');
  });

  it('allows addition with numbers', () => {
    assert.equal(nil.asdf + 1, '1');
  });

  it('has no length', () => {
    assert.equal(nil.length, 0);
  });

  it('can iterate', () => {
    assert.ok(nil.ea(v => assert.fail('This should not execute')));
  });

  it('can be inspected', () => {
    assert.equal(nil.isa(), 'nil');
    assert.equal(isa(nil), 'nil');
  });

  it('cannot be assigned to', () => {
    nil.test = 'nope';
    assert.notEqual(nil.test, 'nope');
  });

  it('cannot be overwritten', () => {
    // eslint-disable-next-line no-global-assign
    nil = 'nope';
    assert.notEqual(nil, 'nope');
  });

  it('handles object prototype functions', () => {
    assert.equal(nil.isPrototypeOf({}), false);
  });

  it('handles or() alternatives', () => {
    assert.equal(nil.or(true), true);
  });

  it('obscures reflection', () => {
    assert.bad(nil.hasOwnProperty('foo'));
  });

  it('offers a workaround falsey evaluation', () => {
    // @NOTE: Ecmascript spec does not support a falsey evaluation from this
    assert.ok(nil);
    assert.bad(nil.or(false));
  });
});
