describe('String tokenization', () => {
  it('parses paragraphs by double newline', () => {
    assert.equal('test\r\n\r\ntest'.paragraphs().length, 2);
    assert.equal('test\n\ntest'.paragraphs().length, 2);
  });

  it('tokenizes strings', () => {
    assert.equal('this is a test'.tokenize().length, 7);
  });

  it('tokenizes floating numbers as one word', () => {
    assert.equal('I am 6.1 feet tall'.tokenize().length, 9);
    assert.equal('Web 2.0'.tokenize().length, 3);
  });

  it('tokenizes contractions as one word', () => {
    assert.equal("I'm ok".tokenize().length, 3);
  });

  it('tokenizes surname prefix as one word', () => {
    assert.equal('Dr. Mary'.tokenize().length, 3);
  });

  it('handles words that start with special characters', () => {
    assert.equal('#metoo hashtag'.tokenize().length, 3);
  });

  it('handles words with even specialer characters', () => {
    assert.equal('! is an exclamation point'.tokenize().length, 9);
  });

  it('handles ellipsis', () => {
    assert.equal("I'm... not sure".tokenize().length, 6);
  });

  it('offers a strict mode that ignores english-isms', () => {
    assert.equal("I'm... not sure".tokenize(true).length, 10);
  });

  it('handles time', () => {
    assert.equal('4:20pm'.tokenize().length, 1);
  });

  it('correctly splits words after tokenization', () => {
    assert.equal("It's 4:20pm... right?".words().length, 3);
    assert.equal(
      "It's 4:20pm... right?".words().join(' '),
      "It's 4:20pm right"
    );
  });

  it('identifies newlines', () => {
    assert(String.isNL('\r'));
    assert(String.isNL('\n'));
    assert(String.isNL('\r\n'));
  });
});

describe('Sentence Parsing', () => {
  it('handles basic sentences', () => {
    assert.equal('Hi. I love you.'.sentences().length, 2);
    assert.equal('Hi! Are you ok?'.sentences().length, 2);
  });

  it('handles double spaces as a sentence terminator', () => {
    // Single space is usually not a terminator after an abbreviation despite the period.
    assert.equal('Dr. I guess'.sentences().length, 1);
    // Double space denotes a new sentence.
    assert.equal('Dr.  I guess'.sentences().length, 2);
    // Otherwise normal period-space combos represent a new sentence.
    assert.equal('Nope. I guess not'.sentences().length, 2);
  });

  it('handles quoted strings', () => {
    assert.equal('"Hi"'.sentences().length, 1);
  });

  it('treats double newlines as a sentence terminator', () => {
    assert.equal('Ok\n\nI guess'.sentences().length, 2);
  });

  it('handles dialog', () => {
    assert.equal('"Hi!" shouted Mary.'.sentences().length, 1);
    assert.equal('"I have no idea," replied George.'.sentences().length, 1);

    // @TODO: This should be two sentences because the speaker clause already exists when the parser reaches `Cindy`
    // assert.equal('Bob said, "No Way!" Cindy screamed.'.sentences().length, 2)
  });

  it('handles parenthesis', () => {
    assert.equal('This is cool (sort of).'.sentences().length, 1);
    assert.equal('This is cool (sort of!).'.sentences().length, 1);
    assert.equal('I like pineapple. (But not on pizza.)'.sentences().length, 2);
    assert.equal(
      'What does this do? (Im really not sure.) It should be good.'.sentences()
        .length,
      3
    );

    assert.equal(
      'This piece of art (if you can call it that), needs work'.sentences()
        .length,
      1
    );

    // @TODO: assert.equal("This is cool (sort of?) but not.".sentences().length, 1);
    // @TODO: assert.equal("I like to read (particularly fiction. Mostly. But not always).".sentences().length, 1);
  });

  it('handles ranges', () => {
    assert.equal(
      'I like the number range 4..20 the most.'.sentences().length,
      1
    );
  });

  it('handles ellipsis', () => {
    assert.equal("Well.. I'm not sure".sentences().length, 1);
    assert.equal("Well... I'm not sure".sentences().length, 1);
    assert.equal("Well?!? I'm not sure".sentences().length, 2);
  });

  it('offers strict parsing', () => {
    assert.equal('Hi! Are you ok?'.sentences(true).length, 2);
  });

  it('handles informal eos punctuation', () => {
    assert.equal('No way!!!!'.sentences().length, 1);
    assert.equal('What?!?!?'.sentences().length, 1);
  });

  it('handles unbalanced parens', () => {
    assert.equal('This ;) is a parenthesis'.sentences().length, 1);
  });

  // @TODO: implement colon/semicolon detection tests
});
