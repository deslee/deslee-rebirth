/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

'use strict';

import 'babel/polyfill';
import path from 'path';
import autoprefixer from 'autoprefixer-core';
import fs from 'fs';
import merge from 'lodash/object/merge';

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

  let STYLE_LOADER = 'style/useable';
  let CSS_LOADER = release ? 'css-loader?minimize' : 'css-loader';

  let config = {
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
        },
        {
          test: /\.scss/,
          loader: `${STYLE_LOADER}!${CSS_LOADER}!postcss-loader!sass-loader`
        },
      ]
    },
    postcss: [autoprefixer(AUTOPREFIXER_BROWSERS)]
  };

  let appConfig = merge({}, config, {
    entry: {
      app: './app/app.js',
      vendors: ['react/addons', 'react/lib/keyMirror', 'react/lib/invariant', 'react/lib/ExecutionEnvironment', 'react-router', 'flux', 'underscore', 'superagent', 'eventemitter3', 'lodash', 'fastclick', 'route-parser']
    },
    output: {
      filename: 'app.js',
      path: path.resolve('build/public')
    },
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
      new webpack.optimize.OccurenceOrderPlugin()
    ].concat(release ? [
        new webpack.optimize.UglifyJsPlugin()
      ] : [])
  });

  var nodeModules = {};
  fs.readdirSync('node_modules')
    .filter(function(x) {
      return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
      nodeModules[mod] = 'commonjs ' + mod;
    });
  nodeModules['react/addons'] = 'commonjs react/addons';

  let serverConfig = merge({}, config, {
    entry: './app/server.js',
    target: 'node',
    output: {
      path: './build',
      filename: 'server.js',
    },
    externals: nodeModules,
    plugins: [
      /*new webpack.IgnorePlugin(/\.(css|less)$/)*/
    ]
  });

  serverConfig.module.loaders = config.module.loaders.map(function(loader) {
    // Remove style-loader
    var newLoader = {
      test: loader.test,
      loader: loader.loader.replace(STYLE_LOADER + '!', '')
    };
    return newLoader;
  });

  return [appConfig, serverConfig]
};
