(function() {
  // @NOTE: These are rudimentary translations.  English is hard.  Unit tests are good.
  // @TODO: finish mapping regex logic:
  // https://github.com/rails/rails/blob/211174a3be8554d54f2df140e601b8d39cc89824/activesupport/lib/active_support/inflections.rb

  Object.protoMap([String.prototype], {
    singularize: function() {
      var parts = this.words();
      var str = parts.pop();

      if (ignores.has(str.toLowerCase())) return this + '';

      return (
        parts.join(' ') +
        ' ' +
        pluralToSingle
          .ea(function(reg) {
            if (reg[0].toRegExp().test(str, 'i')) {
              ea.exit(str.replace(reg[0], reg[1]));
            }
          })
          .or(str)
      ).trim();
    },
    pluralize: function() {
      // returns a word's plural form

      // @TODO: if word ends with -in-law, pluralize the part before -in-law
      // and the prefix dash is important because in-laws is the plural for in-law

      // @NOTE: pluralization rules for pronouns (once we're ready)
      // generally, just add an 's'
      // if ends with (['s', 'x', 'ch', 'z', 'sh']) += 'es';

      // @TODO: handle bidirectionals
      // Mr. >> Messrs.
      // Mrs. >> Mmes.
      // Ms. >> Mses.

      // only concern ourselves with the last word
      var parts = this.words();
      var str = parts.pop();

      if (ignores.has(str.toLowerCase())) return this + '';

      // @NOTE: if word is all caps, append an `'s` and return
      if (str.toUpperCase() == str) return this + "'s";

      return (
        parts.join(' ') +
        ' ' +
        singletoplural
          .ea(function(reg) {
            if (reg[0].toRegExp().test(str, 'i')) {
              ea.exit(str.replace(reg[0], reg[1]));
            }
          })
          .or(str)
      ).trim();
    },
    isPlural: function() {
      return this.pluralize() === this.valueOf();
    },
    isSingular: function() {
      return this.singularize() === this.valueOf();
    },
    possessivize: function() {
      if (this.toLowerCase().endsWith("'s")) {
        return this + '';
      }
      if (this.isPlural()) return this + "'";
      return this + "'s";
    },
    unpossessivize: function() {
      return this.beforeLast("'s").valueOf();
    }
  });

  var ignores = ea({
    sheep: 1,
    fish: 1,
    series: 1,
    species: 1,
    money: 1,
    rice: 1,
    information: 1,
    equipment: 1,
    itunes: 1,
    jargon: 1,
    asphyxia: 1
  });

  var pluralToSingle = [
    ['moves', 'move'],
    ['matches', 'match'],
    ['sexes', 'sex'],
    ['children', 'child'],
    ['men', 'man'],
    ['people', 'person'],
    ['geese', 'goose'],
    ['cacti', 'cactus'],
    [/(quiz)zes$/i, '$1'],
    [/(matr)ices$/i, '$1ix'],
    [/(vert|ind)ices$/i, '$1ex'],
    [/^(ox)en/i, '$1'],
    [/(alias|status)es$/i, '$1'],
    [/(octop|vir)i$/i, '$1us'],
    [/(cris|ax|test)es$/i, '$1is'],
    [/(shoe)s$/i, '$1'],
    [/(o)es$/i, '$1'],
    [/(bus)es$/i, '$1'],
    [/(.*)sis$/i, '$1sis'], // @fixes improper singularizations
    [/([m|l])ice$/i, '$1ouse'],
    [/(x|ch|ss|sh)es$/i, '$1'],
    [/(m)ovies$/i, '$1ovie'],
    [/(s)eries$/i, '$1eries'],
    [/([^aeiouy]|qu)ies$/i, '$1y'],
    [/([lr])ves$/i, '$1f'],
    [/(tive)s$/i, '$1'],
    [/(hive)s$/i, '$1'],
    [/([^f])ves$/i, '$1fe'],
    [/(^analy)ses$/i, '$1sis'],
    [
      /((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i,
      '$1$2sis'
    ],
    [/([ti])a$/i, '$1um'],
    [/(n)ews$/i, '$1ews'],
    [/([^s])s$/i, '$1']
  ];

  var singletoplural = [
    // irregular words or exceptions to general rules
    ['move', 'moves'],
    ['match', 'matches'],
    ['sex', 'sexes'],
    ['child', 'children'],
    ['man', 'men'],
    ['person', 'people'],
    ['goose', 'geese'],

    // css units should not get this treatment
    ['px', 'px'],
    ['em', 'em'],
    ['pt', 'pt'],

    // general english rules
    [/(quiz)$/i, '$1zes'],
    [/^(ox)$/i, '$1en'],
    [/([m|l])ouse$/i, '$1ice'],
    [/(matr|vert|ind)ix|ex$/i, '$1ices'],
    [/(x|ch|ss|sh)$/i, '$1es'],
    [/([^aeiouy]|qu)y$/i, '$1ies'],
    [/(hive)$/i, '$1s'],
    [/(?:([^f])fe|([lr])f)$/i, '$1$2ves'],
    [/sis$/i, 'ses'],
    [/([ti])um$/i, '$1a'],
    [/(buffal|tomat)o$/i, '$1oes'],
    [/(bu)s$/i, '$1ses'],
    [/(alias|status)$/i, '$1es'],
    [/(octop|vir)us$/i, '$1i'],
    [/(ax|test)is$/i, '$1es'],
    [/s$/i, 's'],
    [/$/, 's']
  ];

  // @LICENSE: Plural/Singular logic above was modeled after work by David Hansson
  // Copyright (c) 2005-2012 David Heinemeier Hansson
  // Permission is hereby granted, free of charge, to any person obtaining
  // a copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to
  // permit persons to whom the Software is furnished to do so, subject to
  // the following conditions:

  // The above copyright notice and this permission notice shall be
  // included in all copies or substantial portions of the Software.

  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  // EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  // NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  // LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  // OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
})();
