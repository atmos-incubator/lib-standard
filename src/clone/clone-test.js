describe('Cloning', () => {
  it('can escape JSON', () => {
    assert.equal('\0\r\n"\ttest"'.escapeJSON(), '\\0\\r\\n\\"\\ttest\\"');
  });

  it('can serialize objects', () => {
    assert.equal(ea({ hi: 'there' }).stringify(), '{ "hi": "there" }');
  });

  it('can serialize objects with functions', () => {
    assert.equal(
      ea({ hi: 'there', go: () => {} }).stringify(),
      '{\r\n  "hi": "there",\r\n  "go": () => {}\r\n}'
    );
  });

  it('can handle complex objects', () => {
    assert.equal(
      ea({
        a: true,
        b: /^.*?$/gi,
        c: new Date(10000),
        d: new String('hi')
      }).stringify(),
      '{\r\n  "a": true,\r\n  "b": /^.*?$/gi,\r\n  "c": new Date(10000),\r\n  "d": new String("hi")\r\n}'
    );
  });

  it('can handle arrays and sub objects', () => {
    assert.equal(
      ea({
        a: null,
        b: undefined,
        c: [1, 2, 3],
        d: { hi: 'there' }
      }).stringify(),
      '{\r\n  "a": null,\r\n  "b": undefined,\r\n  "c": [\r\n    1,\r\n    2,\r\n    3\r\n  ],\r\n  "d": { "hi": "there" }\r\n}'
    );
  });

  it('can handle sparse arrays', () => {
    assert.equal(
      [1, null, undefined].stringify(),
      '[\r\n  1,\r\n  null,\r\n  undefined\r\n]'
    );
  });

  it('can handle booleans', () => {
    assert.equal(true.stringify(), 'true');
    assert.equal(false.stringify(), 'false');
  });

  it('can handle unserializable content', () => {
    const stinker = {
      stringify: () => {
        throw new Error();
      }
    };
    const brokenArr = {
      a: [0, stinker, 2]
    };

    assert.includes(ea(brokenArr).stringify(), 'UNQUERYABLE OBJECT');

    const brokenObj = {
      a: stinker
    };

    assert.includes(ea(brokenObj).stringify(), 'UNQUERYABLE OBJECT');
  });

  it('can clone stuff', () => {
    const t = { hi: 'there' };
    const res = ea(t).clone();
    assert.similar(res, t);
    assert.notEqual(res, t);

    // and merge in new properties on clone
    assert.different(res, ea(t).clone({ and: 'more' }));
  });

  it('fails on bad json', () => {
    assert.throws(() => 'asdf: 2lkj;  }'.parse());
  });

  it('handles empty content as undefined', () => {
    assert.equal(''.parse(), undefined);
  });

  it('allows for swallowing errors', () => {
    assert.equal('asdf: 234; }'.parse(true), undefined);
    assert.ok(true);
  });

  it('allows pass-thru deserialization on objects', () => {
    const t = { hi: 'there' };
    assert.equal(t, ea(t).parse());
  });

  it('can summarize really large objects', () => {
    const deep = {
      a: { b: [1, 2] },
      c: { d: { e: [3, 4] } }
    };
    assert.equal(
      ea(deep).stringify(1),
      '{\r\n  "a": { "b":  },\r\n  "c": { "d":  }\r\n}'
    );
  });

  it('"...".parse() handles ea-error constructs', () => {
    assert.equal('ea.exit()'.parse(true), undefined);
    assert.equal('ea.exit(true)'.parse(), true);
    assert.equal('ea(1, (v) => ea.exit(v))'.parse(), 0);
    assert.throws(() => 'die()'.parse());
  });
});
