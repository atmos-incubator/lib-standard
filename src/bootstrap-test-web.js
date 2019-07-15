describe('Bootstrap Web', () => {
  it('parlays properties across global and window', () => {
    global.ttt = true;
    assert(window.ttt);

    window.fff = true;
    assert(global.fff);

    // cleanup
    global.ttt = undefined;
    window.fff = undefined;
  });

  it('defines a global find() helper', () => {
    assert(global.find);
  });
});
