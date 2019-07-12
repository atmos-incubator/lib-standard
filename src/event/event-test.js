describe('Event Queues', () => {
  it('Event.queue() should provide for an event subscription queue', () => {
    assert.ok(Event.queue);
  });

  it('should allow for queuing a function', () => {
    var q = Event.queue();

    var called;
    q(() => (called = true));
    q();

    assert.equal(q.subscribers.length, 1);
    assert.ok(called);
  });

  it('should allow for queuing additional handlers', () => {
    var q = Event.queue(true);
    var called;
    q(() => {});
    q();
    q.push(() => {
      called = true;
    });
    assert.ok(called);
  });

  it('should not invoke on push if not ready or not single', () => {
    var q = Event.queue();
    q(() => {});
    var fn = q.push(() => assert.fail("This shouldn't be called"));
    fn.stop();
    q();
    q(() => assert.fail("This shouldn't be called"));
  });

  it('should allow dequeuing a fn', () => {
    var q = Event.queue();
    q(() => {
      assert.count();
    }).stop();
    q();
    assert.count(0);
  });

  it('should report when exceptions happen', () => {
    sandbox.stub(console, 'error');
    var q = Event.queue(true);
    q(() => {
      throw new Error('IGNORE THIS ERROR');
    });
    assert.throws(q);
    assert(console.error.called);
  });

  it('only invokes single invokes once', () => {
    var q = Event.queue(true);
    q(() => assert.count());
    q();
    assert.count(1);
    q();
    assert.count(0);
  });
});
