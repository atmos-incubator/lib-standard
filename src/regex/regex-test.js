describe('RegExp Helpers', () => {
  it('Defines common regex patterns', () => {
    assert.truth(RegExp.punctuation.test('^$J['));
  });

  it('Escapes strings for regex use', () => {
    assert.equal(RegExp.escape('^.\\'), '\\^\\.\\\\');
  });

  it("Understands a regex's modifier", () => {
    assert.equal(/t/g.modifiers(), 'g');
    assert.equal(/t/gi.modifiers(), 'gi');
    assert.equal(/t/mig.modifiers(), 'gim');
    assert.equal(/t/.modifiers(), '');
  });
});
