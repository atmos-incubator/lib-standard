describe('Dates', () => {
  it('aliases tomorrow', () => {
    assert(isa(Date.tomorrow(), 'number'));
    assert(Date.tomorrow() > Date.now());
  });
});
