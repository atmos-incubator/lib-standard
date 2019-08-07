describe('Functions', () => {
  it('Allow subclassing', () => {
    const fn = (() => assert.fail()).subclass(() => {
      assert.ok(':D');
      return true;
    });

    assert(fn());
  });

  it('Allows subclassing with scope', () => {
    const fn = function() { assert.bad('doh'); };
    const sub = function(orig, args, scope) {
      assert.equal(this.cid, args[0]);
      assert.equal(this, scope);
    };
    fn.subclass({ cid: 'asdf' }, sub)('asdf');
  });

  it('Allow invoking parent', () => {
    const fn = (() => true).subclass(orig => {
      return orig();
    });

    assert(fn());
  });

  it('Preserves toString()', () => {
    const fn = (() => {}).subclass(() => !noop());
    assert.includes(fn.toString(), '!noop');
  });

  it("Doesn't nest", () => {
    const fn = () => {};
    const fn2 = fn.subclass(() => {});
    assert.equal(fn, fn2);
  });

  it('Allows for try-catch', () => {
    const badFn = () => {
      throw new Error('oops');
    };

    assert.ok(badFn.try());
    badFn.try().catch(err => assert.bad(err));

    assert.ok((() => noop(true)).try().catch());
  });

  it('Adds identifier helpers', () => {
    // @NOTE: Several things impact the ability to test these features against fixtures across stacks.
    // @: code coverage logic injection
    // @: webpack manipulation
    assert.equal(noop.source(), noop.stringify());
    assert.equal(noop.guid(), sha(noop.source()));
    assert.equal(noop.id(), 'anonymous:' + sha(noop.source()));
  });

  it('Offers a debounce feature', (done) => {
    const fn = () => { assert.count(); };

    let i = 50;
    while (i--) {
      fn.onPause(10);
    }

    setTimeout(() => {
      assert.count(1);
      done();
    }, 50);
  });
});
