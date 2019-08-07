(function() {
  Object.proto(String.prototype, 'paragraphs', function() {
    return this.split(/(?:\r?\n){2,}/g);
  });

  Object.proto(String.prototype, 'words', function() {
    return this.tokenize()
      .prune()
      .ea(function(word) {
        if (word.match(/[a-z0-9]/i)) return word;
      });
  });

  Object.proto(String.prototype, 'tokenize', function(strict) {
    // Splits english language into words, properly handles contractions, compounds & continuations
    var ret = [];

    var wrd = '';
    var prv = '';
    var nxt = '';

    var chop = function(c) {
      // add word and separately add character
      if (wrd) {
        ret.push(wrd);
      }
      if (c) {
        ret.push(c);
      }
      wrd = '';
    };

    // @NOTE: coerces unicode/foreign letters into ascii 128 equivalents
    var chars = this.toAscii()
      .replace('\r\n', '\n')
      .chars();

    chars.ea(function(c, i, x) {
      nxt = chars[x + 1] || '';

      // if character is not a typical letter, check for start of a new word
      if (c.match(/[^$%#@a-z0-9]/i)) {
        if (wrd) {
          if (strict) {
            chop(c);
          } else if (
            c == '.' &&
            // single letter initials
            (prv.match(/^[A-Z]$/) ||
              // abbreviations with periods
              (wrd + c).isAbbreviation())
          ) {
            // @NOTE: include the periods in initials and abbreviations
            wrd += c;
          } else if (c.match(/['\-:.]/) && nxt.match(/[a-z0-9]/i)) {
            // allow contractions, compounds and continuations, time and money
            wrd += c;
          } else if (c == '.' && chars[i + 1] == '.' && chars[i + 2] == '.') {
            // handle ellipsis as a single word
            chop();
            chop('...');
            ea.skip(2);
          } else {
            chop(c);
          }
        } else {
          // add isolated character
          ret.push(c);
        }
      } else {
        // compile the next word
        wrd += c;
      }
      // track the previous character next loop
      prv = c;
    });

    if (wrd.trim()) {
      // add the last word to the list
      ret.push(wrd);
    }

    return ret;
  });

  // @NOTE: used to determine end of sentence characters in string.proto.sentences and string.proto.tokenize
  const isEOS = function(c) {
    return (
      c == '.' ||
      c == '!' ||
      c == '?' ||
      c == '--' ||
      c == ';' ||
      c == ')' ||
      c == '"'
    );
  };

  const isNL = (String.isNL = function(c) {
    return c == '\n' || c == '\r' || c == '\r\n';
  });

  Object.proto(String.prototype, 'sentences', function(strict) {
    var res = [];

    var sentence = '';
    var para = false;

    this.paragraphs().ea(p => {
      p.lines()
        .trim()
        .prune()
        .join(' ')
        .tokenize()
        .ea(function(t, i) {
          var chop = false;

          var nxt = this[i + 1];
          var nxt2 = this[i + 2];
          // @NOTE: tokenize will parse initials and abbreviations correctly
          // so a previous token may be multiple characters and end with a period but will not trigger isEOS()
          var prv = this[i - 1] || '';
          var prv2 = this[i - 2] || '';

          // @NOTE: this also ignores ranges 4..20 and the starts of ellipses...
          if (isEOS(t) && !isEOS(nxt) && !isEOS(nxt2)) {
            if (t == ')') {
              if (
                isEOS(prv) &&
                (i + 1 !== this.length && !isEOS(nxt) && !isNL(nxt))
              ) {
                // if a parenthesis enclosure has its own end of sentence punctuation, break up the sentences
                // @NOTE: there are plenty of corner cases that would break this lastIndexOf assumption
                // @NOTE: this also protects against text emoji like winky smile ;)
                var parenStart = sentence.lastIndexOf('(');

                if (parenStart >= 0) {
                  res.push(sentence + t);
                  sentence = '';
                  prv = ')';
                  ea.skip(1);
                }
              } else {
                // unless there's an end of sentence character period, parens content is included in the sentence
              }
            } else if (nxt == ' ' || isNL(nxt)) {
              if (strict) {
                chop = true;
              }
            }
          } else if (t == ' ' && isEOS(prv[prv.length - 1])) {
            // @TODO: is the letter match required?
            if (nxt == ' ' && nxt2 && nxt2[0].match(/[A-Z]/)) {
              // @NOTE: this considers double spaces after end of sentence a break (regardless if abbreviation)
              chop = true;
            }

            // Check for end of sentence
            if (prv == '.' || prv == '!' || prv == '?' || prv == ';') {
              // @NOTE: this prevents a two period ellipses from chopping.
              if (prv != '.' || prv2 != prv) {
                chop = true;
              }
            }
          } else {
            // @NOTE: this checks for non-standard capitalization to determine if an abbreviation with a period also
            // ends the sentence but it's cpu intensive and depends on files that are not ready yet.
            // if (t == " " && prv.endsWith(".") && nxt[0].match(/[A-Z]/) && InferCapitalization(nxt)[0].match(/[a-z]/)) {
            //   @TODO: abbreviations that need periods can legitimately end a sentence.  The only way to capture this
            //   (without extensive grammar processing) is to check if the nxt2 word is capitalized and shouldn't be.
            //   @NOTE: This leaves the corner case of a sentence that ends with an abbreviation, followed by a
            //   sentence that begins with a pronoun.  APA royally messed this one up but finally fixed the glitch:
            //   @REF: https://owl.purdue.edu/owl/research_and_citation/apa_style/apa_formatting_and_style_guide/apa_changes_6th_edition.html#The Mechanics of Style
            // }
          }

          sentence += t;

          if (chop) {
            if (sentence.trim() || para) {
              res.push(sentence.trim());
              para = false;
            }
            sentence = '';
            chop = false;
          }
        });

      // add last processed sentence
      res.push(sentence.trim());
    });

    return res;
  });
})();
