describe('Iteration', function() {
  it('should iterate over an array', () => {
    ea([1, 2], v => {
      assert.count();
    });
    assert.count(2);
  });

  it('should iterate over an object', () => {
    var obj = { hi: 'there', bye: 'here' };
    ea(obj, (v, k) => {
      assert.equal(obj[k], v);
      assert.count();
    });
    assert.count(2);
  });

  it('should iterate n times', () => {
    ea(3, v => assert.count());
    assert.count(3);

    ea(0, v => assert.count());
    assert.count(0);
  });

  it('should exit iteration', () => {
    ea(3, v => {
      assert.count();
      ea.exit();
    });
    assert.count(1);
  });

  it('should exit iteration', () => {
    assert.similar(
      ea(4, v => {
        ea.exitIf(assert.count() > 2);
        return true;
      }),
      [true, true]
    );
    assert.count(3);
  });

  it('can skip iterations', () => {
    ea(3, v => {
      assert.count();
      ea.skip(2);
    });
    assert.count(1);
  });

  it('can bubble nested ea stacks', () => {
    var res = ea(3, v => {
      ea(3, v2 => {
        assert.count();
        if (v * v2 == 2) {
          ea.bubble(2, 'done');
        }
      });
    });
    assert.equal(res, 'done');
    assert.count(6);
  });

  it('should iterate asyncly with a second callback', cb => {
    ea(
      3,
      (next, v) => {
        next(v);
      },
      res => {
        assert.async(res.length === 3, cb);
      }
    );
  });

  it('should iterate simultaneously', cb => {
    ea(
      [0, 1, 2],
      (cb, v) => cb(assert.count()),
      res => {
        assert.async(res.length === 3, cb);
        assert.count(3);
      },
      3
    );
  });

  it('should allow removing keys without affecting iteration', () => {
    const t = [0, 1, 2];
    t.ea((v, k) => {
      assert.count();
      if (k == 1) ea.remove(k);
    });
    assert.count(3);
    assert.equal(t.length, 2);
    assert.similar(t, [0, 2]);

    const x = { hi: 'there' };
    ea(x, (v, k) => {
      assert.count();
      ea.remove(k);
    });
    assert.count(1);
    assert.equal(Object.keys(x).length, 0);
  });

  it('should iterate over protoypes', () => {
    const total = Object.keys(String.prototype).length;
    ea(String.prototype, (v, k) => assert.count());
    assert.count(total);
  });

  it('should allow joining arrays', () => {
    const res = [0, 2].ea(v => {
      ea.join([v + 1, v + 2]);
    });
    assert.similar(res, [1, 2, 3, 4]);
  });

  it('should allow merging objects', () => {
    const res = [0, 1].ea(v => {
      ea.merge({ test: v }, true);
    });
    assert.similar(res, { test: 1 });
  });

  it('should allow alternate merge key interface', () => {
    const res = [0, 1].ea(v => {
      ea.merge('test', v);
    });
    assert.similar(res, { test: 1 });
  });

  it('should allow default merges', () => {
    const res = [0, 1].ea(v => {
      ea.merge({ test: v });
    });
    assert.similar(res, { test: 0 });
  });

  it('should try to catch exit during async', () => {
    assert.equal(
      ea(
        3,
        function() {
          ea.exit(true);
        },
        true
      ),
      true
    );

    assert.similar(
      ea(
        3,
        function() {
          ea.exit();
        },
        true
      ),
      []
    );
  });

  it('should otherwise rely on handler.exit for async', cb => {
    ea(
      3,
      (next, v) => {
        if (v === 2) next.exit();
        next(assert.count());
      },
      () => {
        assert.async(assert.count(1), cb);
      }
    );
  });

  it('should optimize empty async iteration', () => {
    ea(
      0,
      v => assert.ok(false, 'this should not iterate'),
      res => assert.count()
    );
    assert.count(1);
  });

  it('can noop over stuff', () => {
    (5).ea();
    assert.ok(true);
  });

  it('can slipstream other prototype functions to values', () => {
    assert.similar(['asdf', 'qwer'].ea('wrap')('<>'), ['<asdf>', '<qwer>']);
  });

  it('does not iterate over object.proto extensions', () => {
    Object.prototype.test = 'oops';
    ea({}, () => assert.ok(false, 'this should not iterate'));
    delete Object.prototype.test;
  });

  it('should allow returning values in async iteration', cb => {
    ea(
      3,
      next => next(),
      res => {
        assert.async(res.length == 0, cb);
      }
    );
  });

  it('handles async object iteration', cb => {
    ea(
      { hi: 'there' },
      (next, v) => next(assert.count()),
      res => assert.async(assert.count(1), cb)
    );
  });

  it('really really stops async iteration', cb => {
    var called;
    ea(
      2,
      (next, v) => {
        if (v == 1) {
          setTimeout(() => {
            called = true;
            next('no dice');
          }, 5);
        }
        next.exit([]);
      },
      res => {
        assert(res.length === 0);
        setTimeout(() => assert.async(called, cb), 10);
      }
    );
  });
});
