describe('Iteration Flow Control', () => {
  it('global.die() throws when called', () => {
    assert.throws(() => {
      try {
        die();
      } catch (e) {
        e.handle();
      }
    });
  });

  it('returns a specific response if provided', () => {
    try {
      ea.exit();
    } catch (e) {
      assert.equal(e.handle(), undefined);
    }

    try {
      ea.exit(true);
    } catch (e) {
      assert.equal(e.handle(), true);
    }
  });

  it('allows for debugging', () => {
    try {
      ea.debug();
    } catch (e) {
      assert.equal(e.handle(), undefined);
    }
  });

  it('logs a message when extra info is provided to ea.debug and debugging is on', () => {
    debug.on = true;
    sandbox.stub(console, 'log');
    try {
      ea.debug('IGNORE THIS');
    } catch (e) {
      assert.equal(e.handle(), undefined);
      assert(console.log.called);
    }
    debug.on = false;
  });

  it('does not log a debug message when debugging is on', () => {
    global.debug.on = true;
    try {
      ea.debug();
    } catch (e) {
      assert.equal(e.handle(), undefined);
      assert(!console.log.called);
    }
    global.debug.on = false;
  });
});
