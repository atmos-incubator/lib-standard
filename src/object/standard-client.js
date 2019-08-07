// istanbul ignore file
const fs = require('fs');
const path = require('path');

Standard.client = res => {
  // @NOTE: Designed to be used in an ExpressJS application to serve the standard lib to the client browser.
  res.setHeader('content-type', 'text/javascript');
  // @TODO: default package.json templates to include compression middleware and app.use(compression) in all expressjs apps
  // @REF: https://expressjs.com/en/advanced/best-practice-performance.html#use-gzip-compression
  fs.createReadStream(path.join(__dirname, '/../../dist/standard.js')).pipe(
    res
  );
};
