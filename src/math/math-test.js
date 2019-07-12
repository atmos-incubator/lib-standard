describe('Math Enhancements', () => {
  it('produces random whole numbers', () => {
    assert.equal(Math.random(0, 5).toString().length, 1);
    assert.ok(Math.random(5).toString().length > 1);
  });

  it('Contains useful constants', () => {
    assert.equal(Math.DREVIL, 1000000);
  });
});
