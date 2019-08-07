const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('../webpack.config.js');
const bodyParser = require('body-parser');

const testConfig = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, 'web-bootstrap.js'),
  target: 'web',
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './test/mocha-test-template.html'
    })
  ],
  devServer: {
    // This allows the mocha test suite to report back on the success of the tests
    before: app => {
      app.post('/results', bodyParser.json(), function(req, res) {
        // Passing = 100% passing in under 2 seconds
        // @NOTE: This duration requirement is flexible, but only with good reason
        const pass = req.body.fail === '0' && req.body.dur * 1 < 2;
        // Tell the browser to close or remain open for debugging
        res.send(pass ? 'close' : 'hold');

        if (pass) {
          console.log('All System Tests Passed');
        } else {
          console.error(
            req.body.fail
              ? req.body.fail + ' System Tests Failed - See Browser For Details'
              : 'System Tests Took Too Long: ' + req.body.dur
          );
        }

        // Give the browser a sec to process the close command
        setTimeout(() => {
          // Based on the results of the test, exit with 0 or 1
          process.exit(pass ? 0 : 1);
        }, 1000);
      });
    }
  }
});

testConfig.module.rules.push(
  {
    // https://webpack.js.org/loaders/mocha-loader/#root
    // @NOTE: Generate mocha bindings for test files and the `test/common.js` bootstrap
    // @TODO: Convert test file naming strategy to test|test-dom|test-web
    test: /(test[\\/]common\.js|src.*?-(test|test-web|test-browser)\.js)$/,
    exclude: /node_modules/,
    use: {
      loader: 'mocha-loader'
    }
  },
  {
    // @NOTE: Allows for serving mocha's css to the client directly from node_modules
    test: /\.css$/,
    loader: 'null-loader'
  }
);

module.exports = testConfig;
