const crypto = require('crypto');

(function() {
  global.sha = (str, shaType) => {
    shaType = def(shaType, 256);
    shaType = shaType === 1 ? 'sha1' : 'sha256';
    return crypto.createHash(shaType).update(str).digest('hex');
  };
})();
