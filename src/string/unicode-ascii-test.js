describe('Unicode', () => {
  it('handles invalid high-low surrogates', () => {
    assert.equal('\uDD01\uD801'.toAscii(), '');
    assert.equal('\uD801'.toAscii(0), '');
  });

  it('parses unicode to ascii', () => {
    assert.equal('À'.toAscii(), 'A');
  });

  it('parses ascii to ascii', () => {
    assert.equal('a'.toAscii(), 'a');
  });

  it("'...'.toAscii() skips unrecognized and unparseable letters", () => {
    assert.equal('Ѡ'.toAscii(), '');
    assert.equal('\uD801'.toAscii(), '');
  });
});
