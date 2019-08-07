describe('Grammar: Plurals', () => {
  it('Converts words from singular to plural', () => {
    assert.equal('duck'.pluralize(), 'ducks');
    assert.equal('goose'.pluralize(), 'geese');
    assert.equal('fish'.pluralize(), 'fish');
    assert.equal('I'.pluralize(), "I's");
  });

  it('Converts plurals to singular', () => {
    assert.equal('octopi'.singularize(), 'octopus');
    assert.equal('cacti'.singularize(), 'cactus');
    assert.equal('beats'.singularize(), 'beat');
    assert.equal('its'.singularize(), 'it');
    assert.equal('fish'.singularize(), 'fish');
  });

  it('Possessivizes words (even made up words like possessivize)', () => {
    assert.equal('Marcus'.possessivize(), "Marcus'");
    assert.equal('nodes'.possessivize(), "nodes'");
    assert.equal('possessivizes'.possessivize(), "possessivizes'");
    assert.equal('node'.possessivize(), "node's");
    assert.equal("node's".possessivize(), "node's");
    assert.equal("node's".unpossessivize(), 'node');
  });

  it('can detect singular or plural', () => {
    assert('node'.isSingular());
    assert(!'nodes'.isSingular());
  });
});
