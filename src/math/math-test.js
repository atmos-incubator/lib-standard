describe('Math Enhancements', () => {
  it('produces random whole numbers', () => {
    assert.equal(Math.random(0, 5).toString().length, 1);

    const bigNum = Math.random(5);
    assert(bigNum > 5);

    const smallNum = Math.random(1, 2);
    assert(smallNum <= 2);
    assert(smallNum >= 1);

    const fraction = Math.random();
    assert(fraction < 1);
    assert(fraction >= 0);
  });

  it('Contains useful constants', () => {
    assert.equal(Math.DREVIL, 1000000);
  });
});
