describe('Window > Find', () => {
  const htmlFixture = () => {
    // @NOTE: mocha's web test harness adds content to the body, so this keeps the tests isolated without destroying the mocha results.
    // @TODO: Figure out a better way to handle this via some sandboxing strategy.
    if (!document.getElementById('test-fixture')) {
      const div = document.createElement('div');
      div.id = 'test-fixture';
      div.style.display = 'none';
      div.innerHTML = '<div id=a class=fixture><div id=b class=fixture></div></div><div id=c class=fixture></div><input name="d" />';
      document.body.appendChild(div);
    }
  };

  it('Adds a global find', () => {
    assert(window.find);
  });

  it('exists on the document and body', () => {
    assert(document.find);
    assert(document.body.find);
  });

  it('find(selector) finds elements', () => {
    assert(find('body').or(null));
  });

  it('find(selector, n) handles scope argument shift', () => {
    htmlFixture();
    assert(find('div.fixture', 2).or(null));
  });

  it('document.find() finds body', () => {
    assert(document.find('body').or(false));
  });

  it('document.find() finds elements', () => {
    htmlFixture();
    assert(document.find('#a').or(null));
  });

  it('Element.find() scopes finds to the element', () => {
    htmlFixture();
    const a = document.body.find('#a');
    assert(a);
    assert.bad(a.find('#c').or(null));
  });

  it('find(selector, true) returns an array of matches', () => {
    htmlFixture();
    assert.equal(document.find('div.fixture', true).length, 3);
    assert.equal(document.find('#noExist', true).length, 0);
  });

  it('find(selector, n) returns the nth entry', () => {
    htmlFixture();
    assert(document.find('div.fixture', 2).or(null));
  });

  it('find(selector, fn) iterates over the results', () => {
    htmlFixture();
    document.find('div.fixture', (el) => assert.count());
    assert.count(3);
  });

  it('find("@name") finds elements by name', () => {
    htmlFixture();
    assert(find('@d').or(null));
    assert(find('input@d').or(null));
  });

  it('find() returns nil if not found', () => {
    assert.equal(find('asdf'), nil);
    assert.equal(find('asdf', true), nil);
  });
});
