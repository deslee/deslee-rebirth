/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

'use strict';


import path from 'path';

var webpack = require('webpack');

/**
 * Get configuration for Webpack
 *
 * @see http://webpack.github.io/docs/configuration
 *      https://github.com/petehunt/webpack-howto
 *
 * @param {boolean} release True if configuration is intended to be used in
 * a release mode, false otherwise
 * @return {object} Webpack configuration
 */
module.exports = function(release) {
  return {
    entry: {
      app: './app/app.js',
      vendors: ['react/addons', 'react-router', 'flux']
    },

    output: {
      filename: 'app.js',
      path: path.resolve('build/public')
    },

    cache: !release,
    debug: !release,
    devtool: false,

    stats: {
      colors: true,
      reasons: !release
    },

    plugins: (release ? [
      new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ] : []).concat([
        // defaults
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
      ]),

    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
    },

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader'
        }
      ]
    }
  };
};
