describe('Global: sha()', () => {
  it('Generates a sha256', () => {
    assert.equal(sha('hi'), '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4');
  });

  it('Allows for sha1', () => {
    assert.equal(sha('hi', 1), 'c22b5f9178342609428d6f51b2c5af4c0bde6a42');
  });
});
