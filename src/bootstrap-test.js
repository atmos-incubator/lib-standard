describe('Bootstrap', () => {
  it('should declare a global context var', () => {
    assert.ok(global, 'global context does not exist');
  });

  it('parlays string functions to arrays', () => {
    const data = [1, null, ' ok'];
    assert.similar(data.prefix('hi '), ['hi 1', null, 'hi  ok']);
    assert.similar(data.ltrim(), [1, null, 'ok']);
    assert.similar(data.replace(' ok', '').trim(), [1, null, '']);
  });

  it('parlays new features to Arrays as well', () => {
    Object.proto(String.prototype, 'arrFoo', function() {
      return this.valueOf();
    });
    assert.similar([1, null, 4].arrFoo(), [1, null, 4]);
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
