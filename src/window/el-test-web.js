describe('Element Features', () => {
  it('Can return a parent element', () => {
    const el = document.body.appendHTML(
      '<div id=a><div id=b><div id=c>asdf</div></div></div>'
    );
    assert.equal(find('#a').parent(), document.body);
    assert.equal(find('#c').parent('#a'), find('#a'));
    el.remove();
  });

  it('Removes attached properties as well as the dom node', () => {
    const el = document.body.appendHTML(
      '<div id=a><div id=b><div id=c>asdf</div></div></div>'
    );
    el.memLeak = { hello: 'mem' };
    el.remove();
  });

  it('can determine element visibility', () => {
    const el = document.body.appendHTML('<div />');
    el.visible(false);
    assert.bad(el.visible());

    el.visible(true);

    // @NOTE: jsdom doesn't handle offsets, so force the measure here
    // @REF: See the polyfill in jsdom-bootstrap.js
    el.style.width = '100px';
    el.style.height = '100px';

    // now that we've styled the body, it should be
    assert(el.visible());
    el.remove();
  });

  it('can return all currently applied styles', () => {
    assert(document.body.cstyle().keys().length > 20);
  });

  it("can return key info about an element's identity", () => {
    assert.equal(document.body.info(), 'html > body');

    const el = document.body.appendHTML('<div />');
    el.className = 'cls1 cls2';
    assert.equal(el.info(), 'html > body > div.cls1.cls2');

    el.id = 'theBody';
    assert.equal(el.info(), 'html > body > div#theBody.cls1.cls2');

    el.name = 'mrBody';
    assert.equal(el.info(), 'html > body > div#theBody[name=mrBody].cls1.cls2');

    el.remove();
  });

  it('can listen to events', () => {
    document.body.on('click', () => {
      assert.count();
    });
    document.body.click();
    document.body.off();
    document.body.click();
    assert.count(1);
  });

  it('Append text to dom', () => {
    const el = document.body.appendHTML('<div/>');
    el.appendText('kung fu');
    assert(el.innerHTML.includes('kung fu'));
    el.remove();
  });

  it('appends html in the right place', () => {
    const el = document.body.appendHTML('<div><span>existing</span></div>');
    el.appendHTML('<div>new</div>');
    assert.equal(el.innerText.lines().trim().join(''), 'existingnew');
    el.remove();
  });

  it('defines a sys prop bag', () => {
    assert.similar(document.body.sys, {});
    const id = guid();
    document.body.sys.id = id;
    assert.equal(document.body.sys.id, id);
    document.body.sys = {};
    assert.similar(document.body.sys, {});
  });

  it('prevents an element from getting focus', () => {
    const input = document.body.appendHTML('<input id=focusTest type=text />');
    document.body.focusable();

    // make sure we can focus on an input
    input.focus();
    assert(document.activeElement === input);

    // allow setting focusable
    input.focusable(true);
    input.focus();
    assert(document.activeElement === input);

    // set focus on another element
    document.body.focus();
    assert(document.activeElement === document.body);

    // prevent focus on input
    input.focusable(false);
    input.focus();
    assert.bad(document.activeElement === input);

    // restore focus on input
    input.focusable(true);
    input.focus();
    assert(document.activeElement === input);

    input.remove();
  });

  it('reports if element is inline or nor (block / flex)', () => {
    const div = document.body.appendHTML('<div />');
    assert(div.isInline() === false);
    div.remove();

    const span = document.body.appendHTML('<span />');
    assert(span.isInline());
    span.remove();
  });

  it('hide or show elements', () => {
    const div = document.body.appendHTML('<div />');
    div.show();
    div.show(false);
    div.show();
    // test if block
    div.show('block');
    div.show(true);

    delete div.sys.display;
    div.show('flex');

    div.show(false);
    delete div.sys.display;
    div.show();

    div.remove();
  });

  it('shows spans appropriately', () => {
    const span = document.body.appendHTML('<span />');
    span.show(true);
    span.remove();
  });
});
