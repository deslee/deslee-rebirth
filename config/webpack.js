/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

'use strict';

import 'babel/polyfill';
import path from 'path';
import autoprefixer from 'autoprefixer-core';
import fs from 'fs';

var webpack = require('webpack');

const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 20',
  'Firefox >= 24',
  'Explorer >= 8',
  'iOS >= 6',
  'Opera >= 12',
  'Safari >= 6'
];

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
export default function(release) {
  const config = {
    cache: !release,
    debug: !release,
    devtool: false,
    stats: {
      colors: true,
      reasons: !release
    },

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
    },
    postcss: [autoprefixer(AUTOPREFIXER_BROWSERS)]
  };

  const appConfig = Object.assign({
    entry: {
      app: './app/app.js',
      vendors: ['react/addons', 'react-router', 'flux']
    },
    output: {
      filename: 'app.js',
      path: path.resolve('build/public')
    },
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ]
  }, config);

  var nodeModules = {};
  fs.readdirSync('node_modules')
    .filter(function(x) {
      return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
      console.log(mod)
      nodeModules[mod] = 'commonjs ' + mod;
    });
  nodeModules['react/addons'] = 'commonjs react/addons';

  const serverConfig = Object.assign({
    entry: './app/server.js',
    target: 'node',
    output: {
      path: './build',
      filename: 'server.js',
    },
    externals: nodeModules,
    plugins: [
      new webpack.IgnorePlugin(/\.(css|less)$/)
    ]
  }, config);

  return [appConfig, serverConfig]
};
