describe('Arrays', () => {
  it('[...].prune() removes empty / whitespace entries from arrays', () => {
    assert.equal(['  ', '', '\t', undefined].prune().length, 0);
  });

  it('[...].prune() does not prune valid entries', () => {
    assert.equal([0, '1', false].prune().length, 3);
  });

  it('[...].last(n) returns the last n entries', () => {
    assert.equal([0, 1, 2].last(2).length, 2);
    assert.equal([0, 1, 2].last(), 2);
  });

  it('handles nil cascade', () => {
    const a = ['a', 'b', 'c', 'd', 'e'];
    assert.similar([0, undefined, 2, 3, 4].ea(v => a.last(v)), [
      [],
      'e',
      ['d', 'e'],
      ['c', 'd', 'e'],
      ['b', 'c', 'd', 'e']
    ]);
  });

  it('[...].random() returns a random entry', () => {
    assert.ok([0, 1, 2].random().toString());
  });

  it('[...].random(2) returns two random entries', () => {
    assert.equal([0, 1, 2].random(2).length, 2);
  });

  it('[0, 1, 2].random(5) returns 5 random entries by repeating results', () => {
    assert.equal([0, 1, 2].random(5).length, 5);
  });

  it('[].random(5) returns an empty array', () => {
    assert.equal([].random(2).length, 0);
  });

  it('[].random() returns undefined', () => {
    assert.equal([].random(), undefined);
  });

  it('[...].flatten() flattens nested arrays', () => {
    assert.similar([0, [1, 2, [3]], 4].flatten(), [0, 1, 2, 3, 4]);
  });

  it('[].pushOnce(any) will append any by reference', () => {
    assert.equal([0, 1].pushOnce(3), true);
  });

  it('[any, foo]..pushOnce(any) will not append a duplicate', () => {
    assert.equal([0, 1].pushOnce(1), undefined);
    assert.equal([0, 1].pushOnce(0), undefined);
  });

  it('[].pushUpdate(any) will append a new entry', () => {
    assert.similar([0, 1, 2].pushUpdate(0), [1, 2, 0]);
  });

  it('[any, foo].pushUpdate(any) will move any to end of array', () => {
    assert.similar([0, 1, 2].pushUpdate(0), [1, 2, 0]);
  });

  it('[any].removeVal(any) removes an entry by value', () => {
    assert.equal([0, 1, 2].removeVal(2).length, 2);
  });

  it("[].removeVal(any) doesn't fail", () => {
    assert.doesNotThrow(() => [].removeVal(2));
  });

  it('Sums arrays', () => {
    assert.equal([1, 2, 3].sum(), 6);
  });
});
