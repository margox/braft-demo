var path = require('path')

module.exports = {
  module: {
    //加载器配置
    rules: [
      { 
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }, {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }, {
        test: /\.(png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name]_[hash:6].[ext]'
            }
          }
        ]
      }, {
        test: /\.(woff2?|eot|ttf|otf|png)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10,
              name: '[name]_[hash:6].[ext]'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, './src'),
      path.join(__dirname, './node_modules')
    ],
    alias: {
      'react': path.join(__dirname, 'node_modules', 'react'),
      'sassinc': path.join(__dirname, './src/assets/scss/_inc.scss')
    },
    extensions: ['.js', '.jsx']
  }
}