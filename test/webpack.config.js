const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('../webpack.config.js');

const testConfig = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, 'web-bootstrap.js'),
  target: 'web',
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './test/mocha-test-template.html'
    })
  ]
});

testConfig.module.rules.push(
  {
    // https://webpack.js.org/loaders/mocha-loader/#root
    // @NOTE: Generate mocha bindings for test files and the `test/common.js` bootstrap
    test: /(test[\\/]common\.js|src.*?-(test|test-web)\.js)$/,
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
