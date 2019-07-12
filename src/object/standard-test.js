describe('Standardized Prototypes', () => {
  it('Standard constructor exists', () => {
    assert(global.Standard);
    assert(Standard.features);
    assert(Standard.protos);
    assert(Standard.ize);
    assert.doesNotThrow(Standard);
  });

  it('Standard constructor is read only', () => {
    assert.throws(() => (global.Standard = null));
  });

  it('allows for adding new properties', () => {
    // via kvp
    Standard.ize('foo', function() {
      return 'bar';
    });
    assert.equal(''.foo(), 'bar');

    // via object of kvp
    Standard.ize({
      gewd: function() {
        return 'luck';
      }
    });
    assert.equal(''.gewd(), 'luck');
  });

  it('Allows for registering a new prototype', () => {
    function MyTest() {}
    Standard.ize(MyTest.prototype);

    Standard.ize('bar', function() {
      return 'baz';
    });

    function ArrayTest() {}
    Standard.ize([ArrayTest.prototype]);

    assert.equal(new MyTest().bar(), 'baz');
    assert.equal(new ArrayTest().bar(), 'baz');
  });
});
