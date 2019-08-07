describe('Window > Fullscreen', () => {
  it('Can detect fullscreen status', () => {
    assert.bad(isFullscreen());
  });

  it('Can listen for fullscreen change', () => {
    onFullscreenChange(() => { noop(); });
    setFullscreen();
    assert.ok(':)');
  });

  it('Can set fullscreen?', () => {
    setFullscreen(find('body'));
    assert.ok(':)');
  });

  it('Can set fullscreen on window', () => {
    setFullscreen();
    assert.ok(':)');
  });
});
