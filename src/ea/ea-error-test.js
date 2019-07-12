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

    sandbox.stub(console, 'log');
    try {
      ea.debug('IGNORE THIS');
    } catch (e) {
      assert.equal(e.handle(), undefined);
      assert(console.log.called);
    }

    global.debug.on = true;
    try {
      ea.debug();
    } catch (e) {
      assert.equal(e.handle(), undefined);
    }
    global.debug.on = false;
  });
});
