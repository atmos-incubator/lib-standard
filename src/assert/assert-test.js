describe('Asserts', () => {
  it('aliases assert.equal', () => {
    assert(assert.equals);
    assert.equals(true, true);
    assert.throws(() => assert.equals(true, false));
  });

  it('assert.equiv() provides a `==` similarity assertion', () => {
    assert.equiv('0', 0);
    assert.equiv(1, true);
  });

  it('makes negative tests easier', () => {
    assert.bad(false);
    assert.bad(new Error());
  });

  it('makes async tests easier', fn => {
    assert.async(true, fn);
  });

  it('makes bad async tests easier', fn => {
    assert.asyncBad(false, fn);
  });

  it('makes testing object equivalence slightly better', () => {
    assert.similar({ hi: 'there', bye: 'bye' }, { bye: 'bye', hi: 'there' });
  });

  it('makes range tests easier', () => {
    assert.includes([0, 1, 3], 3);
  });

  it('allows for inline count assertions', () => {
    ea(3, () => assert.count());
    assert.count(3);
  });

  it('asserts strict true', () => {
    assert.truth(true);
    assert.throws(() => assert.truth(false));
    assert.throws(() => assert.truth(1));
  });

  it('improves on strictDeepEqual', () => {
    assert.deepStrictEqual({ a: 1, b: 2 }, { b: 2, a: 1 });
  });

  it('assert.divergent confirms whether an object has subtly but equivalently changed', () => {
    assert.divergent({ a: true }, { a: 1 });
    assert.throws(() => assert.divergent({ a: true }, { a: true }));
  });
});
