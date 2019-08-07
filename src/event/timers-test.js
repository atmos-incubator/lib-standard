describe('Enhanced Timers', () => {
  it('allows for clearing timeouts', function(done) {
    setTimeout(function() {
      done(new Error('timeout should not have been called'));
    }, 10);
    clearTimers();
    setTimeout(done, 20);
  });

  it('allows for rescheduling a timer by default', done => {
    const fn = function() {
      assert.count();
    };
    setTimeout(fn, 10);
    setTimeout(fn, 10);
    setTimeout(() => {
      assert.count(1);
      done();
    }, 20);
  });

  it('allows for rescheduling an interval', function(done) {
    this.retries(5);
    const fn = () => assert.count();
    setInterval(fn, 5);
    setInterval(fn, 10);
    setTimeout(() => {
      clearTimers();
      assert.count(1);
      done();
    }, 17);
  });

  it('disallows string evaluation for timer fn', () => {
    assert.throws(() => setTimeout('console.log("no!");', 5)); // eslint-disable-line no-implied-eval
  });

  it('supports intervals', function(done) {
    this.retries(3);
    setInterval(() => assert.count(), 5);

    setTimeout(() => {
      clearTimers();
      assert.count('gt', 1);
      done();
    }, 50);
  });

  it('supports exiting the invocation', done => {
    setTimeout(() => ea.exit(true), 10);
    setTimeout(() => done(), 20);
  });

  it('reports errors and throws them', done => {
    // @TODO: This global error intercept logic should be abstracted into a utility function
    let restore;
    const newException = () => {
      assert.count();
      restore();
      return false;
    };
    if (isNode) {
      const originalException = process.listeners('uncaughtException').pop();
      process.removeListener('uncaughtException', originalException);
      process.prependOnceListener('uncaughtException', newException);
      restore = () => {
        process.removeListener('uncaughtException', newException);
        process.prependOnceListener('uncaughtException', originalException);
      };
    } else {
      // @TODO: window.off('error') / window.on('error', fn) doesn't work as it should
      const originalException = global.onerror;
      global.onerror = newException;
      restore = () => {
        global.onerror = originalException;
      };
    }
    setTimeout(() => {
      throw new Error('oops');
    }, 10);
    setTimeout(() => {
      assert.count(1);
      done();
    }, 20);
  });

  it('defaults ms to 1', done => {
    let t = 0;
    setTimeout(() => (t = 1));
    setTimeout(() => (t = 2), 10);
    setTimeout(() => {
      assert.equal(t, 1);
      done();
    }, 5);
  });
});
