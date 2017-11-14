const path = require('path')
const srcDir = path.join(__dirname, 'src')
const dstDir = path.join(__dirname, 'build')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: srcDir,
  entry: {
    overlay: ['./overlay.styl', './overlay.js'],
    config: ['./config.styl', './config.js'],
    vendor: ['./global.styl']
  },
  output: {
    filename: '[name].js',
    path: dstDir,
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        // gotta include node_modules sadly...
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-es2017'],
            plugins: ['transform-strict-mode']
          }
        }
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!stylus-loader'
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      { test: /\.marko$/, use: 'marko-loader' }
    ]
  },

  resolve: {
    alias: {},
    extensions: ['.marko', '.js']
  },

  devtool: 'cheap-module-source-map',

  devServer: {
    contentBase: dstDir
  },

  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      title: 'IcoParse',
      filename: 'index.html',
      excludeChunks: ['config']
    }),
    new HtmlWebpackPlugin({
      title: 'IcoParse Config',
      filename: 'config/index.html',
      excludeChunks: ['overlay']
    })
  ]
}
