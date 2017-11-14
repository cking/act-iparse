const path = require('path')
const srcDir = path.join(__dirname, 'src')
const dstDir = path.join(__dirname, 'build')
const indev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: srcDir,
  entry: {
    overlay: ['./overlay.styl', './overlay.js'],
    config: [],
    vendor: ['./global.styl']
  },
  output: {
    filename: '[name].js',
    path: dstDir,
    publicPath: '/',
    pathinfo: indev
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-es2017']
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

  cache: !indev,
  devtool: indev ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',

  devServer: {
    contentBase: dstDir
  },

  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      title: 'IcoParse',
      filename: 'index.html',
      excludeChunks: 'config'
    }),
    new HtmlWebpackPlugin({
      title: 'IcoParse Config',
      filename: 'config/index.html',
      excludeChunks: 'overlay'
    }),
    indev ? new webpack.HotModuleReplacementPlugin({}) : null
  ]
}
