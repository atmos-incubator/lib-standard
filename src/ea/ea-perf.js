describe('ea() Performance', () => {
  it('1 million natural loops in under 10ms', function() {
    this.retries(3);
    this.timeout(10);
    for (let i = 0; i < Math.DREVIL; i++) {
      noop(i);
    }
  });

  it('1 million ea() loops in under 100ms', function() {
    this.retries(3);
    this.timeout(100);
    ea(Math.DREVIL, noop);
  });

  it('10 million ea() loops should be less than a second', function() {
    this.retries(3);
    this.timeout(1000);
    ea(Math.DREVIL * 10, noop);
  });
});
