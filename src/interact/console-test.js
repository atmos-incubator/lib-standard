describe('Console Enhancements (hidden due to stubs)', () => {
  beforeEach(() => {
    // @NOTE: this will prevent mocha from reporting success / fail lines, but errors will report after summary list.
    sandbox.stub(console, 'log');
    sandbox.stub(console, 'error');
    sandbox.stub(console, 'warn');
  });

  it('logs stuff', () => {
    log('asdf', 2);
    assert.equal(console.log.called, true);
  });

  it('warns stuff', () => {
    warn('asdf');
    assert.equal(console.warn.called, true);
  });

  it('errors stuff', () => {
    error('asdf');
    assert.equal(console.error.called, true);
  });

  it('debugs stuff only if debugging is on', () => {
    debug('nope');
    assert.equal(console.log.called, false);

    debug.on = true;
    debug('yep');
    assert.equal(console.log.called, true);
    debug.on = false;
  });
});
