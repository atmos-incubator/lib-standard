describe('Strings', () => {
  it('endsWith', () => {
    assert.ok('test'.endsWith('st'));
    assert.bad('test'.endsWith('we'));
    assert.equal('test'.endsWith(0), undefined);
  });

  it('startsWith', () => {
    assert.ok('test'.startsWith('te'));
    assert.bad('test'.startsWith('we'));
  });

  it('normalizes join', () => {
    assert.equal('test'.join(''), 'test');
  });

  it('splits lines', () => {
    assert.equal('test\ntest'.lines().length, 2);
    assert.equal('test\r\ntest'.lines().length, 2);
    assert.equal('test\rtest'.lines().length, 1);
  });

  it('cuts line', () => {
    assert.equal('test'.after('te'), 'st');
    assert.equal('test'.after('st'), '');
    assert.equal('test'.after('q'), undefined);
    assert.equal('test'.after(1), 'st');
    assert.throws(() => 'test'.after(false));

    assert.equal('test'.before('st'), 'te');
    assert.equal('test'.before('te'), '');
    assert.equal('test'.before('q'), undefined);
    assert.equal('test'.before(1), 'te');
    assert.throws(() => 'test'.before(false));

    assert.equal('test'.beforeLast('t'), 'tes');
    assert.equal('test'.beforeLast('q'), 'test');
  });

  it('trims', () => {
    assert.equal(' test '.trim(), 'test');
    assert.equal(' test '.ltrim(), 'test ');
    assert.equal(' test '.ltrim(' t'), 'est ');
    assert.equal(' test '.ltrim('t'), ' test ');
    assert.equal(' test '.rtrim(), ' test');
  });

  it('prefix', () => {
    assert.equal('test'.prefix('new '), 'new test');
    assert.equal('test'.prefix(0), '0test');
  });

  it('suffix', () => {
    assert.equal('test'.suffix('Asdf'), 'testAsdf');
  });

  it('quietly evals strings', () => {
    assert.equal('test'.tryval(), undefined);
    assert.equal('23test'.tryval(), undefined);
    assert.throws(() => '23test'.tryval(true));
  });

  it('ssv', () => {
    assert.equal('test this'.ssv().length, 2);
  });

  it('chars', () => {
    assert.equal('test'.chars().length, 4);
  });

  it('capitalize', () => {
    assert.equal('test'.capitalize(), 'Test');
    assert.equal('test this'.capitalize(), 'Test this');
    assert.equal('42 this'.capitalize(), '42 this');
    assert.equal('This is good'.capitalize(), 'This is good');
  });

  it('removes newlines', () => {
    assert.equal('test'.removeNewlines(), 'test');
    assert.equal('this\r\ntest'.removeNewlines(), 'this test');
    assert.equal('this\ntest'.removeNewlines(), 'this test');
    assert.equal('this\rtest'.removeNewlines(), 'this test');
  });

  it('wraps', () => {
    assert.equal('hi'.wrap('!'), '!hi!');
    assert.equal('hi'.wrap('!', '?'), '!hi?');
    assert.equal('hi'.wrap('<>'), '<hi>');
    assert.equal('hi'.wrap(['<', '/>']), '<hi/>');
  });

  it('without', () => {
    assert.equal('test'.without('es'), 'tt');
    assert.equal('tesTest'.without('es'), 'tTt');
  });

  it('from', () => {
    assert.equal('test'.from('e'), 'est');
    assert.equal('test'.from(''), 'test');
    assert.equal('test'.from(''), 'test');
    assert.equal('test'.from('q'), '');
    assert.equal('test'.from(1), 'est');
  });
});
