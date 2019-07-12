(function() {
  // @DOC: basic handling for common english abbreviations

  var abbrLookup;

  Object.proto(String.prototype, 'isAbbreviation', function() {
    // cache permutations of these structures on first use
    if (!abbrLookup) {
      // use a null object to perform key lookups without namespace conflicts
      abbrLookup = Object.create(null);

      [initialisms, acronyms, abbreviations].ea(function(list) {
        list.ea(function(token) {
          // generate variants of each abbreviation
          abbrLookup[token] = true;
          abbrLookup[token.toLowerCase()] = true;
          abbrLookup[token.without('.')] = true;
          abbrLookup[token.without('.').toLowerCase()] = true;
        });
      });
    }

    return abbrLookup[this.valueOf()];
  });

  var initialisms = [
    // @NOTE: These are defined with periods for easier processing / conversion.
    'R.S.V.P.',
    'P.S.',
    'A.S.A.P.',
    'E.T.A.',
    'B.Y.O.B.',
    'D.I.Y',
    'B.A.',
    'B.S.',
    'M.A.',
    'J.D.',
    'D.C.',
    'P.A.',
    'M.D.',
    'V.P.',
    'S.V.P.',
    'E.V.P.',
    'C.M.O.',
    'C.F.O.',
    'C.E.O.',
    'P.M.',
    'A.M.',
    'B.C.',
    'A.D.',
    'i.e.',
    'etc.',
    'e.g.',
    'n.b.',
    'r.p.m.',
    'S.S.R.',
    'U.S.S.R.',
    'R.N.',
    'S.E.A.T.O.',
    'S.E.C.',
    'Y.M.C.A.',
    'L.T.',
    'A.W.O.L.',
    'A.B.',
    'B.A.',
    'm.p.h.',
    'N.E.',
    'N.W.',
    'S.W.',
    'S.E.',
    'U.S.',
    'U.S.A.',
    'U.S.A.F.',
    'U.S.C.G.',
    'U.S.M.C.',
    'U.S.N.',
    'V.F.W.'
  ];

  var acronyms = [
    // @NOTE: Acronyms are pronounced as words, not as a series of initials. This is key to determining 'a' vs 'an'.
    'U.N.I.C.E.F.',
    'C.A.D.',
    'N.O.R.A.D.'
  ];

  var abbreviations = [
    'tsp.',
    'tbsp.',
    'gal.',
    'lb.',
    'lbs.',
    'pt.',
    'qt.',
    'Ave.',
    'Blvd.',
    'Ln.',
    'Rd.',
    'const.',
    'avg.',
    'abbr.',
    'Acad.',
    'Assn.',
    'wt.',
    'Ave.',
    'cal.',
    'Capt.',
    'Col.',
    'Comdr.',
    'Corp.',
    'Cpl.',
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.',
    'dept.',
    'dist.',
    'Dr.',
    'ed.',
    'est.',
    'et.',
    'al.',
    'fl.',
    'oz.',
    'ft.',
    'gal.',
    'Gen.',
    'Gov.',
    'grad.',
    'Hon.',
    'hr.',
    'inc.',
    'Inst.',
    'Jr.',
    'lat.',
    'lng.',
    'Lt.',
    'Ltd.',
    'mi.',
    'min.',
    'Mr.',
    'Mrs.',
    'Msgr.',
    'mt.',
    'mts.',
    'Mus.',
    'pl.',
    'pop.',
    'pseud.',
    'pt.',
    'pub.',
    'qt.',
    'Rev.',
    'rr.',
    'sec.',
    'Sgt.',
    'sq.',
    'Sr.',
    'St.',
    'uninc.',
    'Univ.',
    'vol.',
    'vs.',
    'v.',
    'yd.',
    'cu.',
    'doz.',
    'gr.',
    'kt.',
    'Ch.',
    'Dr.'
  ];
})();
