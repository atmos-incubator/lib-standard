describe('Iteration Proxy', () => {
  it('should wrap objects', () => {
    assert(ea({ hi: 'there' }).hi === 'there');
  });

  it('should not wrap arrays', () => {
    assert(ea({}).isProxy);
    assert(![].isProxy);
  });

  it('should allow ea on objects and arrays', () => {
    assert(ea({}).ea);
    assert([0, 1, 2].ea);
  });

  it('should iterate on proxied objects', () => {
    assert(ea({ hi: 'there', bye: 'bye' }).ea(v => 1).length === 2);
  });

  it('should iterate on arrays', () => {
    assert([0, 1, 2].ea(v => 1).length === 3);
  });

  it('should iterate over strings', () => {
    assert('test'.ea(v => 1).length === 4);
  });

  it('{}.has(key) returns true if object has key property', () => {
    assert(ea({ hi: 'there' }).has('hi'));
  });

  it('should declare a global ea reference', () => {
    assert.ok(global.ea, 'global context does not exist');
  });

  it('should wrap any object with ea extensions', () => {
    assert.ok(ea({ hi: 'there' }).ea, 'missing chain ea iterator');
  });

  it('should throw on no args', () => {
    assert.throws(() => ea(), assert.AssertionError);
  });

  it('should allow for or-ing a truthy value when empty array result', () => {
    assert.equal(ea([]).or(true), true);
    assert.similar(ea(2, v => v).or(20), [0, 1]);
  });

  it('Does not corrupt instanceOf for common native objects', () => {
    assert(ea({}) instanceof Object);
    assert(ea([]) instanceof Array);
    assert(ea(new Number(0)) instanceof Number);
    assert(ea(new String(0)) instanceof String);
    assert(ea(/^asdf$/) instanceof RegExp);
  });

  it("Doesn't break instanceOf", () => {
    function T() {}
    const t = ea(new T());
    assert.ok(t instanceof T);
    assert.ok(t.toObject() instanceof T);
  });

  it("We don't lose toObject identity on property assignment", () => {
    const t = ea({ hi: 'there' });
    t.bye = 'bye';
    assert(t.toObject().bye);
  });

  it('Offers workarounds for equality checks', () => {
    const o = { hi: 'there' };
    const u = ea(o);
    assert.ok(u.toObject() === o);

    assert.ok(ea(global).eq(global));
    assert.ok(ea(o).eq(ea(o)));

    const t = [0, 1];
    assert.ok(t.eq(t));
    assert.ok(t.eq(ea(t)));
    assert.ok(ea(global).toObject() === global);
  });

  it('Does not corrupt isa()', () => {
    assert(isa(ea({}), 'object'));
    assert(isa(ea([]), 'array'));
    assert(isa(ea(0), 'number'));
    assert(isa(ea(null), 'null'));
    assert(isa(ea(undefined), 'undefined'));
  });

  it('converts standard objects back into original base object', () => {
    const obj = { hi: 'there' };
    assert.similar(ea(obj).toObject(), obj);
    assert.equal(ea(obj).toObject(), obj);
  });
});
