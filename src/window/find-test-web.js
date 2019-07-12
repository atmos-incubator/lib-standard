describe('Window > Find', () => {
  const htmlFixture = '<div id=a><div id=b></div></div><div id=c></div><input name="d" />';

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
    document.body.innerHTML = htmlFixture;
    assert(find('div', 2).or(null));
  });

  it('document.find() finds body', () => {
    assert(document.find('body').or(false));
  });

  it('document.find() finds elements', () => {
    document.body.innerHTML = htmlFixture;
    assert(document.find('#a').or(null));
  });

  it('Element.find() scopes finds to the element', () => {
    document.body.innerHTML = htmlFixture;
    const a = document.body.find('#a');
    assert(a);
    assert.bad(a.find('#c').or(null));
  });

  it('find(selector, true) returns an array of matches', () => {
    document.body.innerHTML = htmlFixture;
    assert.equal(document.find('div', true).length, 3);
    assert.equal(document.find('#noExist', true).length, 0);
  });

  it('find(selector, n) returns the nth entry', () => {
    document.body.innerHTML = htmlFixture;
    assert(document.find('div', 2).or(null));
  });

  it('find(selector, fn) iterates over the results', () => {
    document.body.innerHTML = htmlFixture;
    document.find('div', (el) => assert.count());
    assert.count(3);
  });

  it('find("@name") finds elements by name', () => {
    document.body.innerHTML = htmlFixture;
    assert(find('@d').or(null));
    assert(find('input@d').or(null));
  });

  it('find() returns nil if not found', () => {
    assert.equal(find('asdf'), nil);
    assert.equal(find('asdf', true), nil);
  });
});
