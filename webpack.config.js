var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './src/components/index.js'],
  },
  output: {
    path: path.join(__dirname, '/dist/public/'),
    filename: '[name].js',
    publicPath: 'http://localhost:8080/'
  },
  module: {
   loaders: [
     {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          "presets": ["react", "es2015", "stage-0"]
        }
      },{
        test: /\.json?$/,
        loader: 'json'
      }, {
        test: /\.css$/,
        loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
      }]
  },
 plugins: [
   new HtmlWebpackPlugin({
    template: 'src/static/index.html',
    inject: 'body',
    filename: 'index.html'
  }),
   new webpack.HotModuleReplacementPlugin()
 ]
}
