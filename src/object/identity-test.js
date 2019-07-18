
describe('Object Identity', () => {
  it('Object.getConstructorType() should return a lowercase moniker of the constructor name', () => {
    assert.equal(Object.getConstructorType(null), 'null');
    assert.equal(Object.getConstructorType(undefined), 'undefined');
    assert.equal(Object.getConstructorType(global), 'object');
    assert.equal(Object.getConstructorType({}), 'object');
    assert.equal(Object.getConstructorType([]), 'array');
    assert.equal(Object.getConstructorType(true), 'boolean');
    assert.equal(Object.getConstructorType(0), 'number');
  });

  it("gets an object's constructor", () => {
    assert.equal(Object.getConstructor({}), Object);
    assert.equal(Object.getConstructor(null), undefined);
    assert.equal(Object.getConstructor(nil), undefined);
  });

  it('global.isa() should return the getConstructorType or compare it with a provided test', () => {
    assert.equal(isa([]), 'array');
    assert.equal(isa([], 'array'), true);
    assert.equal([].isa(), 'array');
    assert.equal([].isa('array'), true);
  });

  it('global.def() returns the first defined argument', () => {
    assert.equal(def(undefined, 2), 2);
    assert.equal(def(null, 2), 2);
    assert.equal(def(nil, 1), 1);
  });

  it('global.def() returns undefined when no arguments are defined', () => {
    assert.equal(def(undefined, null), undefined);
  });

  it('Object.isPrototype detects prototype objects', () => {
    assert.ok(Object.isPrototype(Object.prototype));
    function T() {}
    assert.ok(Object.isPrototype(T.prototype));
  });

  it('Object.isPrototype detects non prototype objects', () => {
    assert.bad(Object.isPrototype(Object));
    assert.bad(Object.isPrototype('hi'));
    assert.bad(Object.isPrototype(null));
    assert.bad(Object.isPrototype(undefined));
    assert.bad(Object.isPrototype([]));
    assert.bad(Object.isPrototype({}));
    assert.bad(Object.isPrototype(false));
    assert.bad(Object.isPrototype(0));
    assert.bad(Object.isPrototype(Object.create(null)));
    assert.bad(Object.isPrototype({ constructor: () => {} }));
    assert.bad(Object.isPrototype(Object.create({ constructor: () => {} })));
    assert.bad(Object.isPrototype(nil));
    assert.bad(Object.isPrototype(undef));
    assert.bad(Object.isPrototype(global));
  });

  it('isa() detects scalars', () => {
    assert.truth(isa(3, 'scalar'));
    assert.truth(!isa({}, 'scalar'));
    assert.truth(!isa(nil, 'scalar'));
    assert.truth(!isa(() => {}, 'scalar'));
  });

  it('isa() detects prototypes', () => {
    assert.truth(isa(Object.prototype, 'prototype'));
    assert.bad(isa({}, 'prototype'));
  });

  it('isa() detects nulls', () => {
    assert.truth(isa(null, null));
    assert.truth(isa(null, 'null'));
    assert.truth(isa(null, 'nil'));
    assert.truth(isa(null, 'undef'));
  });

  it("Object.getPrototypeRef() returns an object's prototype reference", () => {
    assert.equal(Object.getPrototypeRef({}), Object.prototype);
    assert.equal(Object.getPrototypeRef(null), undefined);
    assert.equal(Object.getPrototypeRef(nil), undefined);
  });

  it('has() reports on local hasOwn properties', () => {
    assert.truth(has({ hi: 'there' }, 'hi'));

    // valueOf is on the prototype
    assert.bad(has({ hi: 'there' }, 'valueOf'));

    // nil's have nothing (even nil extensions)
    assert.bad(has(nil, 'valueOf'));
    assert.bad(has(nil, 'or'));
  });
});
