var webpack = require('webpack')
   , merge = require('webpack-merge')
   , path = require('path')
   , HtmlWebpackPlugin = require('html-webpack-plugin')
   , baseConfigs = require('./webpack.config.base')

module.exports = merge(baseConfigs, {
  devtool: 'source-map',
  entry: {
    index : './src/index.jsx'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    stats: { chunks:false },
    contentBase: './src',
    hot: true
  }
})