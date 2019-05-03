'use strict'

const path = require('path')
const UglifyJsPlugin = require("uglifyjs-3-webpack-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    'paw-web-component': './libs/index.js',
    'paw-web-component.min': './libs/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve('src/sources'),
      'npm': path.resolve('node_modules'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve('libs')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            // options: {
            //   presets: ['es2015', 'stage-2']
            // }
          }
        ]
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'paw-web-component[name].css',
            },
          },
          'extract-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      // {
      //   test: /\.css/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: 'paw-web-component.css',
      //       },
      //     },
      //     'extract-loader',
      //     'css-loader'
      //   ]
      // }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new UglifyJsPlugin({
      include: /\.min\.js$/,
    }),
  ]
}