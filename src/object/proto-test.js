describe('Prototypes', () => {
  it('Object.proto() prevents arrow functions', () => {
    assert.throws(() => Object.protoMap(String.prototype, {
      noArrows: () => { }
    }));

    assert.throws(() => Object.proto(String.prototype, 'noArrows', () => { }));
  });

  it('Object.proto() allows easy property binding to Standard objects', () => {
    Object.protoMap({
      foo: function() { return 'bar'; }
    });
    assert.equal(ea({}).foo(), 'bar');

    Object.proto('biz', function() {
      return 'baz';
    });

    assert.equal(ea({}).biz(), 'baz');
  });

  it('Object.proto() prevents Object.prototype extensions without `global.VERBOTEN` flag', () => {
    assert.throws(() => Object.proto(Object.prototype, 'foo', noop));
  });
});
