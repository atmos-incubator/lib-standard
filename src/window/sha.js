// istanbul ignore file because we only use this in a browser context
module.exports = function(win) {
  // @NOTE: There is a legit crypto api available on the web, but it doesn't allow for synchronous sha() computations. I
  // _could_ change the api to existing sha() features to be promise/async but that forces consumers to change their
  // behavior. Plus this api is only served over https or localhost which isn't universal. I've used this library for
  // years without any issues so I'll keep this impl of sha256 here for now.
  // @REF: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest

  // SHA-1/256 implementation in JavaScript

  // (c) Chris Veness 2002-2012 | www.movable-type.co.uk

  // License: LGPL && CC-BY & Permission Granted In Writing from Chris Veness
  //          sha256 - LGPL: You are welcome to re-use these scripts [under a LGPL license, without
  //                   any warranty express or implied] provided solely that you retain my
  //                   copyright notice and a link to this page.
  //          sha1 - CC-BY: You are welcome to re-use these scripts [under a simple attribution license,
  //                 without any warranty express or implied] provided solely that you retain
  //                 my copyright notice and a link to this page:

  //          Original Copyright Holder
  //          <http://movable-type.co.uk/scripts/sha256.html>
  //          <http://movable-type.co.uk/scripts/sha1.html>

  //          Copyright License Information
  //          <http://creativecommons.org/licenses/by/3.0/>
  //          <http://www.gnu.org/licenses/lgpl-2.1.html>

  // SHA Reference: <http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html>
  // Usage Examples: <http://csrc.nist.gov/groups/ST/toolkit/examples.html>

  // Modifications: This library has been slightly modified by Marcus Pope to conform to
  //                Atmos coding standards and practices.  No modifications have
  //                been made to the algorithms used in this library.
  var self = this;

  win.sha = function(msg, shaType, utf8encode) {
    // @DOC: Generates a sha[1||256] encoding of {msg}
    //  @param {String} msg                String to be hashed
    //  @param {int} Type of sha encoding either 1 or 256 - defaults to 256
    //  @param {Boolean} [utf8encode=true] Encode msg as UTF-8 before generating hash

    shaType = def(shaType, 256);
    shaType = shaType == 1 ? self.hash1 : self.hash256;

    utf8encode = def(utf8encode, true);

    msg = msg.toString();

    // convert string to UTF-8, as SHA only deals with byte-streams
    if (utf8encode) msg = self.encode(msg);

    return shaType(msg);
  };

  // allow for differentiation between server and client implementations
  win.sha.polyfill = true;

  self.hash256 = function(msg) {
    // @DOC: Generates SHA-256 hash of string
    //  @param {String} msg                String to be hashed
    //  @returns {String}                  Hash of msg as hex character string

    // constants [�4.2.2]
    var K = [
      0x428a2f98,
      0x71374491,
      0xb5c0fbcf,
      0xe9b5dba5,
      0x3956c25b,
      0x59f111f1,
      0x923f82a4,
      0xab1c5ed5,
      0xd807aa98,
      0x12835b01,
      0x243185be,
      0x550c7dc3,
      0x72be5d74,
      0x80deb1fe,
      0x9bdc06a7,
      0xc19bf174,
      0xe49b69c1,
      0xefbe4786,
      0x0fc19dc6,
      0x240ca1cc,
      0x2de92c6f,
      0x4a7484aa,
      0x5cb0a9dc,
      0x76f988da,
      0x983e5152,
      0xa831c66d,
      0xb00327c8,
      0xbf597fc7,
      0xc6e00bf3,
      0xd5a79147,
      0x06ca6351,
      0x14292967,
      0x27b70a85,
      0x2e1b2138,
      0x4d2c6dfc,
      0x53380d13,
      0x650a7354,
      0x766a0abb,
      0x81c2c92e,
      0x92722c85,
      0xa2bfe8a1,
      0xa81a664b,
      0xc24b8b70,
      0xc76c51a3,
      0xd192e819,
      0xd6990624,
      0xf40e3585,
      0x106aa070,
      0x19a4c116,
      0x1e376c08,
      0x2748774c,
      0x34b0bcb5,
      0x391c0cb3,
      0x4ed8aa4a,
      0x5b9cca4f,
      0x682e6ff3,
      0x748f82ee,
      0x78a5636f,
      0x84c87814,
      0x8cc70208,
      0x90befffa,
      0xa4506ceb,
      0xbef9a3f7,
      0xc67178f2
    ];

    // initial hash value [�5.3.1]
    var H = [
      0x6a09e667,
      0xbb67ae85,
      0x3c6ef372,
      0xa54ff53a,
      0x510e527f,
      0x9b05688c,
      0x1f83d9ab,
      0x5be0cd19
    ];

    // PREPROCESSING
    msg += String.fromCharCode(0x80); // add trailing '1' bit (+ 0's padding) to string [�5.1.1]

    // convert string msg into 512-bit/16-integer blocks arrays of ints [�5.2.1]
    var l = msg.length / 4 + 2; // length (in 32-bit integers) of msg + �1� + appended length
    var N = Math.ceil(l / 16); // number of 16-integer-blocks required to hold 'l' ints
    var M = new Array(N);

    for (let i = 0; i < N; i++) {
      M[i] = new Array(16);
      for (let j = 0; j < 16; j++) {
        // encode 4 chars per integer, big-endian encoding
        M[i][j] =
          (msg.charCodeAt(i * 64 + j * 4) << 24) |
          (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) |
          (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) |
          msg.charCodeAt(i * 64 + j * 4 + 3);
      } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }

    // add length (in bits) into final pair of 32-bit integers (big-endian) [�5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32);
    M[N - 1][14] = Math.floor(M[N - 1][14]);
    M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff;

    // HASH COMPUTATION [�6.1.2]
    var W = new Array(64);
    var a, b, c, d, e, f, g, h;
    for (let i = 0; i < N; i++) {
      // 1 - prepare message schedule 'W'
      for (let t = 0; t < 16; t++) W[t] = M[i][t];
      for (let t = 16; t < 64; t++) {
        W[t] =
          (self.sigma3(W[t - 2]) +
            W[t - 7] +
            self.sigma2(W[t - 15]) +
            W[t - 16]) &
          0xffffffff;
      }

      // 2 - initialize working variables a, b, c, d, e, f, g, h with previous hash value
      a = H[0];
      b = H[1];
      c = H[2];
      d = H[3];
      e = H[4];
      f = H[5];
      g = H[6];
      h = H[7];

      // 3 - main loop (note 'addition modulo 2^32')
      for (let t = 0; t < 64; t++) {
        var T1 = h + self.sigma1(e) + self.ch(e, f, g) + K[t] + W[t];
        var T2 = self.sigma0(a) + self.maj(a, b, c);
        h = g;
        g = f;
        f = e;
        e = (d + T1) & 0xffffffff;
        d = c;
        c = b;
        b = a;
        a = (T1 + T2) & 0xffffffff;
      }

      // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
      H[0] = (H[0] + a) & 0xffffffff;
      H[1] = (H[1] + b) & 0xffffffff;
      H[2] = (H[2] + c) & 0xffffffff;
      H[3] = (H[3] + d) & 0xffffffff;
      H[4] = (H[4] + e) & 0xffffffff;
      H[5] = (H[5] + f) & 0xffffffff;
      H[6] = (H[6] + g) & 0xffffffff;
      H[7] = (H[7] + h) & 0xffffffff;
    }

    return (
      self.toHexStr(H[0]) +
      self.toHexStr(H[1]) +
      self.toHexStr(H[2]) +
      self.toHexStr(H[3]) +
      self.toHexStr(H[4]) +
      self.toHexStr(H[5]) +
      self.toHexStr(H[6]) +
      self.toHexStr(H[7])
    );
  };

  self.hash1 = function(msg) {
    // @DOC: Generates SHA-1 hash of string
    // @param {String} msg String to be hashed
    // @returns {String} Hash of msg as hex character string

    // constants [�4.2.1]
    var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];

    // PREPROCESSING
    msg += String.fromCharCode(0x80); // add trailing '1' bit (+ 0's padding) to string [�5.1.1]

    // convert string msg into 512-bit/16-integer blocks arrays of ints [�5.2.1]
    var l = msg.length / 4 + 2; // length (in 32-bit integers) of msg + �1� + appended length
    var N = Math.ceil(l / 16); // number of 16-integer-blocks required to hold 'l' ints
    var M = new Array(N);

    for (let i = 0; i < N; i++) {
      M[i] = new Array(16);
      for (let j = 0; j < 16; j++) {
        // encode 4 chars per integer, big-endian encoding
        M[i][j] =
          (msg.charCodeAt(i * 64 + j * 4) << 24) |
          (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) |
          (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) |
          msg.charCodeAt(i * 64 + j * 4 + 3);
      } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }

    // add length (in bits) into final pair of 32-bit integers (big-endian) [�5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32);
    M[N - 1][14] = Math.floor(M[N - 1][14]);
    M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff;

    // set initial hash value [�5.3.1]
    var H0 = 0x67452301;
    var H1 = 0xefcdab89;
    var H2 = 0x98badcfe;
    var H3 = 0x10325476;
    var H4 = 0xc3d2e1f0;

    // HASH COMPUTATION [�6.1.2]
    var W = new Array(80);
    var a, b, c, d, e;

    for (let i = 0; i < N; i++) {
      // 1 - prepare message schedule 'W'
      for (let t = 0; t < 16; t++) W[t] = M[i][t];
      for (let t = 16; t < 80; t++) {
        W[t] = self.rotl(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
      }

      // 2 - initialise five working variables a, b, c, d, e with previous hash value
      a = H0;
      b = H1;
      c = H2;
      d = H3;
      e = H4;

      // 3 - main loop
      for (let t = 0; t < 80; t++) {
        var s = Math.floor(t / 20); // seq for blocks of 'f' functions and 'K' constants
        var T =
          (self.rotl(a, 5) + self.f(s, b, c, d) + e + K[s] + W[t]) & 0xffffffff;
        e = d;
        d = c;
        c = self.rotl(b, 30);
        b = a;
        a = T;
      }

      // 4 - compute the new intermediate hash value
      H0 = (H0 + a) & 0xffffffff; // note 'addition modulo 2^32'
      H1 = (H1 + b) & 0xffffffff;
      H2 = (H2 + c) & 0xffffffff;
      H3 = (H3 + d) & 0xffffffff;
      H4 = (H4 + e) & 0xffffffff;
    }

    return (
      self.toHexStr(H0) +
      self.toHexStr(H1) +
      self.toHexStr(H2) +
      self.toHexStr(H3) +
      self.toHexStr(H4)
    );
  };

  self.rotr = function(n, x) {
    // rotate right
    return (x >>> n) | (x << (32 - n));
  };

  self.rotl = function(x, n) {
    // rotate left (circular left shift) value x by n positions [�3.2.5]
    return (x << n) | (x >>> (32 - n));
  };

  self.sigma0 = function(x) {
    return self.rotr(2, x) ^ self.rotr(13, x) ^ self.rotr(22, x);
  };

  self.sigma1 = function(x) {
    return self.rotr(6, x) ^ self.rotr(11, x) ^ self.rotr(25, x);
  };

  self.sigma2 = function(x) {
    return self.rotr(7, x) ^ self.rotr(18, x) ^ (x >>> 3);
  };

  self.sigma3 = function(x) {
    return self.rotr(17, x) ^ self.rotr(19, x) ^ (x >>> 10);
  };

  self.f = function(s, x, y, z) {
    // function 'f' [�4.1.1]
    switch (s) {
      case 0:
        return self.ch(x, y, z);
      case 1:
        return self.parity(x, y, z);
      case 2:
        return self.maj(x, y, z);
      case 3:
        return self.parity(x, y, z);
      default:
        return null;
    }
  };

  self.parity = function(x, y, z) {
    return x ^ y ^ z;
  };

  self.ch = function(x, y, z) {
    return (x & y) ^ (~x & z);
  };

  self.maj = function(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
  };

  self.toHexStr = function(n) {
    // hexadecimal representation of a number
    //   (note toString(16) is implementation-dependant, and
    //   in IE returns signed numbers when used on full words)
    var s = '';
    var v;
    for (let i = 7; i >= 0; i--) {
      v = (n >>> (i * 4)) & 0xf;
      s += v.toString(16);
    }
    return s;
  };

  self.encode = function(strUni) {
    // @DOC: Encode multi-byte Unicode string into utf-8 multiple single-byte characters (BMP / basic multilingual plane
    // only)
    // Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
    // @param {String} strUni Unicode string to be encoded as UTF-8
    // @returns {String} encoded string

    // use regular expressions & String.replace callback function for better efficiency
    // than procedural approaches
    var strUtf = strUni.replace(
      /[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function(c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | (cc >> 6), 0x80 | (cc & 0x3f));
      }
    );

    strUtf = strUtf.replace(
      /[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function(c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(
          0xe0 | (cc >> 12),
          0x80 | ((cc >> 6) & 0x3f),
          0x80 | (cc & 0x3f)
        );
      }
    );

    return strUtf;
  };
  self.decode = function(strUtf) {
    // @DOC: Decode utf-8 encoded string back into multi-byte Unicode characters
    // @param {String} strUtf UTF-8 string to be decoded back to Unicode
    // @returns {String} decoded string
    // @NOTE: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
    var strUni = strUtf.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
      function(c) {
        // (note parentheses for precedence)
        var cc =
          ((c.charCodeAt(0) & 0x0f) << 12) |
          ((c.charCodeAt(1) & 0x3f) << 6) |
          (c.charCodeAt(2) & 0x3f);
        return String.fromCharCode(cc);
      }
    );
    strUni = strUni.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
      function(c) {
        // (note parentheses for precedence)
        var cc = ((c.charCodeAt(0) & 0x1f) << 6) | (c.charCodeAt(1) & 0x3f);
        return String.fromCharCode(cc);
      }
    );
    return strUni;
  };
};
