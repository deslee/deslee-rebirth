/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

'use strict';

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md
import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import del from 'del';
import mkdirp from 'mkdirp';
import webpack from 'webpack';
import path from 'path';

const $ = loadPlugins();
const src = Object.create(null);

const BUILD_DIR = './build';
const PUBLIC_DIR = './build/public';
const APP_DIR = './app';
const DEBUG = process.env.NODE_ENV !== 'production';

var watch_array = [];
function watch(pattern, tasks) {
  watch_array.push({
    pattern,
    tasks
  });
}

gulp.task('clean', done => {
  del(['.tmp', 'build/*', '!build/.git'], {dot: true}, () => {
    mkdirp('build/public', done);
  });
});

gulp.task('bundle', cb => {
  const configGenerator = require('./config/webpack.js');
  let config = configGenerator(!DEBUG);
  const compiler = webpack(config);

  var statReport = (err, stats) => {
    let verbose = DEBUG;

    // print stats
    console.log(stats.toString({
      colors: $.util.colors.supportsColor,
      hash: verbose,
      version: verbose,
      timings: verbose,
      chunks: verbose,
      chunkModules: verbose,
      cached: verbose,
      cachedAssets: verbose
    }));

    if(cb) {
      cb();
      cb = null;
    }
  };

  if (DEBUG) {
    compiler.watch({
      aggregateTimeout: 100
    }, statReport);
  }
  else {
    compiler.run(statReport);
  }
});

gulp.task('move:index', () => {
  src.index = [
    path.join(APP_DIR, 'index.html')
  ];

  watch(src.index, ['move:index']);

  return gulp.src(src.index)
    .pipe(gulp.dest(PUBLIC_DIR));
});

gulp.task('move', done => {
  runSequence(['move:index'], done)
});

gulp.task('compile:sass', () => {
  src.sass = [
    path.join(APP_DIR, 'style.scss')
  ];

  watch(src.sass, ['compile:sass']);

  return gulp.src(src.sass)
    .pipe($.plumber())
    .pipe($.sass())
    .pipe(gulp.dest(PUBLIC_DIR));
});

gulp.task('watch', cb => {
  watch_array.forEach(watch => {
    gulp.watch(watch.pattern, watch.tasks);
  });
  cb();
});

gulp.task('build', cb => {
  runSequence(['move', 'compile:sass', 'bundle'], cb)
});

gulp.task('default', done => {
  runSequence(['clean'], ['build'], ['watch'], done)
});