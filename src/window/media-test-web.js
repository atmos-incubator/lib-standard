describe('Media Element', () => {
  it('Has an isPlaying property', () => {
    assert.truth(document.createElement('video').isPlaying === false);
  });
});
