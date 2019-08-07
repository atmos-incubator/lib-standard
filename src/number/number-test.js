describe('Numbers', () => {
  it('detects numeric values', () => {
    assert((4).isNumeric());
    assert((0.01).isNumeric());
    assert('3'.isNumeric());
    assert.bad(''.isNumeric());
    assert.bad(ea({}).isNumeric());
  });

  it('any.toFloat() parses floats', () => {
    assert.equal('0.01'.toFloat(), 0.01);
  });

  it('Numerical values into duration', () => {
    assert.equal((3).duration('d').toString(), '3d');
    assert.equal((1000).duration().toString(), '1s');
    assert.equal((500).duration('ms').toString(), '500ms');
    assert.equal((1001).duration().toString(), '1s 1ms');
  });

  it('1..duration() validates unit parameter', () => {
    assert.throws(() => (400).duration('minutes'));
  });

  it('1..between(min, max)', () => {
    assert.truth((4).between(3, 5));
  });
});
