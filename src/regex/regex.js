(function() {
  ea(
    {
      punctuation: /[^a-z\d]/gi,
      html: /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,
      email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i,
      guid: /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/,
      parens: /\(.*?\)/,
      doublespace: /[ ]{2,}/,
      capitals: /([A-Z])/,
      hex: /^#?[A-F0-9]+$/i,
      rgba: /^rgba? ?\( ?(\d+)[, ]+(\d+)[, ]+(\d+)[, ]*([\d.]+)? ?\)$/i,
      jsvar: /([a-z$_][[\].a-z0-9$_-]*?)/i,
      phoneNumbers: [
        /(\d{3}-?\d{3}-?\d{4})/i,
        /(\(\d{3}\) \d{3}[- ]\d{4})/i
      ],
      addresses: [
        /\s*([0-9]*)\s((NW|SW|SE|NE|S|N|E|W))?(.*)((NW|SW|SE|NE|S|N|E|W))?((#|APT|BSMT|BLDG|DEPT|FL|FRNT|HNGR|KEY|LBBY|LOT|LOWR|OFC|PH|PIER|REAR|RM|SIDE|SLIP|SPC|STOP|STE|TRLR|UNIT|UPPR|,)[^,]*)(,)([\s\w]*)/gi,
        /\d+[ ](?:[A-Za-z0-9.-]+[ ]?)+(?:Avenue|Lane|Road|Boulevard|Drive|Street|Ave|Dr|Rd|Blvd|Ln|St).?/gi,
        /(\d+) ((\w+[ ,])+ ){2}([A-Z]){2} (\d){5}/
      ],
      url: /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gi
    },
    (v, k) => {
      Object.defineProperty(RegExp, k, { get: () => v });
    }
  );

  RegExp.escape = function(text) {
    // used to escape text to be used in regex rules
    return text.replace(/[-[\]{}(),.?\\|#$^*+\s]/g, '\\$&');
  };

  RegExp.prototype.modifiers = function() {
    // returns string of modifiers from this regex
    return (
      '' +
      (this.global ? 'g' : '') +
      (this.ignoreCase ? 'i' : '') +
      (this.multiline ? 'm' : '')
    );
  };

  Object.proto([String.prototype], 'toRegExp', function(opt) {
    return new RegExp(this.valueOf(), opt);
  });
  Object.proto([RegExp.prototype], 'toRegExp', function(opt) {
    return new RegExp(this.source, opt);
  });

  // @LICENSE: for RegExp.html
  // Copyright JS Foundation and other contributors, https://js.foundation/
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
