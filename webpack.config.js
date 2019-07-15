const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // @TODO: Allow for extensible modes https://webpack.js.org/configuration/mode/
  mode: 'development',
  entry: './index.js',
  output: {
    filename: 'standard.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        // https://webpack.js.org/loaders/babel-loader/#root
        test: /src.*?(?!-test|-web|-perf)\.js$/,
        exclude: /node_modules|test/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
