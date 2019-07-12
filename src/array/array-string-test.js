describe('Arrays of Strings', () => {
  it('has access to string.proto features', () => {
    assert.equal(['aa', 'ab', 'ac'].ltrim('a').join(''), 'abc');
  });

  it('has string like behavior', () => {
    assert.similar([0, 1, 2].after(1), [2]);
    assert.similar([0, 'test', 2].after('test'), [2]);
    assert.equal([0, 1].after(2), undefined);
  });
});
