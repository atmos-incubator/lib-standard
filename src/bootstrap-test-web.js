describe('Mocha JSDOM Environment', () => {
  it('parlays properties across global and window', () => {
    // window and global are not the same object, but they feel like it.
    assert.notEqual(window, global);

    global.ttt = true;
    assert(window.ttt);

    window.fff = true;
    assert(global.fff);

    // @NOTE: They don't work with `delete` operator
    delete global.fff;
    assert(global.fff);
    assert(window.fff);

    // @NOTE: But chances can be manually cleaned up in tests
    delete window.fff;
    assert.bad(window.fff);
    assert.bad(global.fff);
  });
});
