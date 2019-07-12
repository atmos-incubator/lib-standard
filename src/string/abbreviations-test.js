describe('Abbreviations and Initialisms', () => {
  it('returns true if characters are likely to be an abbreviation', () => {
    assert('ave'.isAbbreviation());
    assert.bad('nope'.isAbbreviation());
  });
});
