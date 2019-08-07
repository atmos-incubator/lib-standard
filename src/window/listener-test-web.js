describe('Event Listeners', () => {
  it('Patches addEventListener on various objects', () => {
    assert(new XMLHttpRequest().addEventListener.patched);
    assert(document.body.addEventListener.patched);
    assert(window.addEventListener.patched);
    assert(addEventListener.patched);
  });

  it('Can register an event on a dom node', () => {
    document.body.on('init', () => {
      assert.count();
    });
    assert.count(1);
  });

  it('Aliases obscure event names to rational event names', () => {
    document.body.on('rightclick', () => {});
    assert(document.body.events.has('contextmenu'));
  });

  it('Ensures key-based events make an element focusable', () => {
    const defaultIdx = navigator.userAgent.match(/Edge/) ? 0 : -1;

    const el = document.body.appendHTML('<span />');
    assert.equal(el.tabIndex, defaultIdx);

    el.focusable(false);
    assert.equal(el.tabIndex, defaultIdx);

    el.on('keypress', () => {});
    assert.equal(el.tabIndex, 0);

    el.remove();
  });

  it('makes multiple event binding easy', () => {
    document.body.on('keypress keydown', () => {});
    document.body.off('keypress');
    assert(document.body.events.has('keydown'));
    assert.bad(document.body.events.has('keypress'));
    document.body.off();

    document.body.on({
      keypress: noop,
      keydown: noop,
      keyup: noop
    });
    assert(document.body.events.has('keyup'));
    document.body.off();
  });

  it('prevents binding mistakes', () => {
    assert.throws(() => document.body.on('mousemove'));
  });

  it('still allows for native use of removeEventListener', () => {
    document.body.addEventListener('mouseenter', noop, false);
    assert.notEqual(document.body.events, undefined);
    document.body.removeEventListener('mouseenter', noop, false);
    assert.equal(document.body.events, undefined);
  });

  it('ignores ea errors inside event handlers', () => {
    document.body.on('click', () => {
      ea.exit();
    });
    document.body.click();
    // const ev = document.createEvent('HTMLEvents');
    // ev.initEvent('click', false, true);
    // document.body.dispatchEvent(ev);
    document.body.off();
  });

  it('reports other errors inside event handlers', done => {
    // @TODO: This global error intercept logic should be abstracted into a utility function
    let restore;
    const newException = () => {
      assert.count();
      restore();
      done();
      return false;
    };

    if (typeof document === 'undefined') {
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
      restore = () => (global.onerror = originalException);
    }

    document.body.on('click', () => {
      throw new Error('oops');
    });
    document.body.click();
    document.body.off();
    assert.count(1);
  });

  it("doesn't register a listener twice for the same event", () => {
    assert.count(0);
    const fn = () => {
      assert.count();
    };
    document.body.on('click', fn);
    document.body.on('click', fn);
    document.body.on('click', fn);

    document.body.click();

    assert.count(1);
  });

  it('cleans up listener trackers appropriately', () => {
    const fn1 = () => { return false; };
    const fn2 = () => { return true; };

    const id = document.body.on('click', fn1);
    document.body.on('click', fn2);

    assert(document.body.events[id]);
    document.body.removeEventListener(id);

    assert.bad(document.body.events[id]);
    document.body.off('click');
  });
});
