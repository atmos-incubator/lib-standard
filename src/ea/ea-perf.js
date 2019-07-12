describe('ea() Performance', () => {
  it('1 million natural loops in under 10ms', function() {
    this.timeout(10);
    for (let i = 0; i < Math.DREVIL; i++) {
      noop(i);
    }
  });

  it('1 million ea() loops in under 100ms', function() {
    this.timeout(100);
    ea(Math.DREVIL, noop);
  });
});
