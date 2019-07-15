describe('Prototypes', () => {
  it('Object.proto() prevents arrow functions', () => {
    assert.throws(() =>
      Object.protoMap(String.prototype, {
        noArrows: () => {}
      })
    );
    assert.throws(() => Object.proto(String.prototype, 'noArrows', () => {}));
  });

  it('Object.proto() allows easy property binding to Standard objects', () => {
    Object.protoMap({
      foo: function() {
        return 'bar';
      }
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

  it('Object.proto() auto promotes String extensions to Number and vice versa', () => {
    assert.equal((4).ltrim(), 4);
    assert.equal('4.321'.toPrecision(2), '4.3');
  });

  it('Object.proto.toArray() should promote scalar extensions to Arrays', () => {
    assert.similar(['a', 'b', 'c'].repeat(3), ['aaa', 'bbb', 'ccc']);
  });

  it('Object.proto.prop() will not override a property by default', () => {
    assert.bad(''.noOverWrite);

    Object.proto.prop(String.prototype, 'noOverWrite', noop);
    assert.equal(''.noOverWrite, noop);

    Object.proto.prop(String.prototype, 'noOverWrite', 'changeFail');
    assert.equal(''.noOverWrite, noop);
  });
});
