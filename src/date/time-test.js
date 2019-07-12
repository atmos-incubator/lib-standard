describe('Time', () => {
  it('should help with days', () => {
    assert.equal((1).days(), 86400000);
    assert.equal((2).days(), 172800000);
  });
});
