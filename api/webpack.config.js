const path = require('path')
const slsw = require('serverless-webpack')

const webpack = require('webpack')

module.exports = {
  entry: slsw.lib.entries,
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    // hacky hack hack https://stackoverflow.com/questions/41522744/webpack-import-error-with-node-postgres-pg-client
    alias: {
      'pg-native': 'src/dummy.js',
    },
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  plugins: [new webpack.IgnorePlugin(/^pg-native$/)],
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
}
