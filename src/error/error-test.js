describe('Errors', () => {
  beforeEach(() => {
    sandbox.stub(global, 'error');
  });

  it('can be selectively tossed', () => {
    assert.throws(() => new Error().toss());
    assert.ok(ea({}).toss());
    assert.ok(toss({}));
    assert.throws(() => toss(new Error()));
    assert.throws(() => toss(new Error(), { extra: 'info' }));
  });

  it('can show a stack trace', () => {
    if (!global.workingSourceMaps) return;

    // @NOTE: the line number needs to match the actual line number of this file.
    assert.includes(Error.getStack().lines()[0], 'error-test.js:18');
  });

  it('can detonate errors', () => {
    assert.throws(() => new Error('bye').die({ no: 'good' }));
    assert.throws(() => new Error('bye').die());
  });
});
