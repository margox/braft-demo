var webpack = require('webpack')
  , merge = require('webpack-merge')
  , HtmlWebpackPlugin = require('html-webpack-plugin')
  , OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
  , path = require('path')
  , baseConfigs = require('./webpack.config.base')

module.exports = merge(baseConfigs, {
  context: path.join(__dirname, './src'),
  entry: {
    index: './index.jsx'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'braft-demo.js',
    publicPath: './'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /.css$/,
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        }
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    })
  ]
})
