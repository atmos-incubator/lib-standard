describe('Window > Find', () => {
  beforeEach(() => {
    document.body.appendHTML(`
      <div id="test-fixture" style="display: none;">
        <div id=a class=fixture>
          <div id=b class=fixture></div>
        </div>
        <div id=c class=fixture></div>
        <input name="d" />
      </div>
    `);
  });
  afterEach(() => {
    find('#test-fixture').remove();
  });

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
    assert(find('div.fixture', 2).or(null));
  });

  it('document.find() finds body', () => {
    assert(document.find('body').or(false));
  });

  it('document.find() finds elements', () => {
    assert(document.find('#a').or(null));
  });

  it('Element.find() scopes finds to the element', () => {
    const a = document.body.find('#a');
    assert(a);
    assert.bad(a.find('#c').or(null));
  });

  it('find(selector, true) returns an array of matches', () => {
    assert.equal(document.find('div.fixture', true).length, 3);
    assert.equal(document.find('#noExist', true).length, 0);
  });

  it('find(selector, n) returns the nth entry', () => {
    assert(document.find('div.fixture', 2).or(null));
  });

  it('find(selector, fn) iterates over the results', () => {
    document.find('div.fixture', el => assert.count());
    assert.count(3);
  });

  it('find("@name") finds elements by name', () => {
    assert(find('@d').or(null));
    assert(find('input@d').or(null));
  });

  it('find() returns nil if not found', () => {
    assert.equal(find('asdf'), nil);
    assert.equal(find('asdf', true), nil);
  });
});
