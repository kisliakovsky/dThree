const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
  {
    entry: {
      app: ['./lib/main.js'],
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '/assets/',
      filename: 'bundle.js',
    },
    devtool: 'inline-source-map',
    plugins: [
      new ExtractTextPlugin('index.css'),
    ],
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: [/(node_modules|bower_components)/],
          loader: 'babel-loader',
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader'],
          }),
        },
        {
          test: /\.ttf$/,
          loader: 'file?name=font/[name].[ext]',
        },
      ],
    },
  },
];
