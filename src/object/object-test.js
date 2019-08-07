describe('Standard Objects', () => {
  it('should convert arguments to array', () => {
    assert(
      (function(arg1, arg2) {
        assert.similar(ea(arguments), ['1', '2']);
        assert.similar(ea(arguments).toArray(), ['1', '2']);
        return true;
      })('1', '2')
    );
  });

  it('should convert standard objects to AoTuple', () => {
    assert.similar(ea({ hi: 'there' }).toArray(), [['hi', 'there']]);
  });

  it('should allow sorting by the keys', () => {
    assert.equal(
      ea({ hi: 'there', bye: 'bye' })
        .sort()
        .keys()[0],
      'bye'
    );
  });

  it('should allow checking for inclusion', () => {
    assert(ea({ hello: 'world' }).includes('world'));
  });

  it('{}.slice() allows for extracting sub-objects.', () => {
    assert.similar(ea({ hello: 'world', bye: 'planet' }).slice(['hello', 'goodbye']), { hello: 'world' });
  });
});
