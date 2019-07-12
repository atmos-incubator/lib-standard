describe('Bootstrap', () => {
  it('should declare a global context var', () => {
    assert.ok(global, 'global context does not exist');
  });

  it('parlays string functions to arrays', () => {
    assert.similar(['test', 1, 'ok'].prefix('hi '), ['hi test', 1, 'hi ok']);
  });

  it('declares a noop()', () => {
    assert.equal(noop('hi'), 'hi');
  });

  it('declares a guid()', () => {
    assert.ok(guid());
  });

  it('defines basic lifecycle hooks', () => {
    assert.ok(global.onInit);
    assert.ok(global.onExit);
  });

  it('invokes onInit', cb => {
    onInit(() => {
      assert.async(true, cb);
    });
  });

  it('invokes onLoad', cb => {
    onLoad(() => {
      assert.async(true, cb);
    });
  });
});
