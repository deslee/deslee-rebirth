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
import browserify from 'browserify';
import watchify from 'watchify';
import mkdirp from 'mkdirp';
import path from 'path';
import through from 'through2';
import fm from 'front-matter';
import fs from 'fs';
import vinylMap from 'vinyl-map';
import source from 'vinyl-source-stream';
import babelify from 'babelify';
import buffer from 'vinyl-buffer';
const $ = loadPlugins();
const src = Object.create(null);

const BUILD_DIR = './build';
const PUBLIC_DIR = './build/public';
const APP_DIR = './app';
const DEBUG = process.env.NODE_ENV !== 'production';

var watch_array = [];
const external_modules = [
  'react/addons',
  'react/lib/keyMirror',
  'react/lib/invariant',
  'react/lib/ExecutionEnvironment',
  'react',
  'react-router',
  'flux',
  'underscore',
  'superagent',
  'eventemitter3',
  'lodash',
  'underscore',
  'fastclick',
  'route-parser',
  'moment'
];

function watch(pattern, tasks) {
  watch_array.push({
    pattern,
    tasks
  });
}

gulp.task('clean', done => {
  del(['.tmp', 'build/*', '!build/.git'], {dot: true}, () => {
    mkdirp('build/public', () => {
      mkdirp('build/data', done);
    });
  });
});

gulp.task('bundle:vendors', () => {
  var b = browserify({
    debug: DEBUG,
    entries: ['./app/vendor.js']
  });

  b.require(external_modules);

  return b.bundle()
    .pipe(source('./app/vendor.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.uglify())
    .on('error', $.util.log)
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./build/public'));
});

gulp.task('bundle', () => {
  var b = watchify(browserify(Object.assign({
    debug: DEBUG,
    entries: ['./app/main.js'],
    transform: [babelify],
    bundleExternal: false
  }, watchify.args)));

  b.on('update', () => {
    runSequence(['bundle'])
  });
  b.on('log', $.util.log);
  b.on('prebundle', function prebundle(b) {
    return external_modules.forEach(external => {
        b = b.external(external)
      });
  });

  return b.bundle()
    .pipe(source('./app/app.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
    // Add transformation tasks to the pipeline here.
    .pipe($.uglify())
    .on('error', $.util.log)
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./build/public'));
});

gulp.task('move:favicon', () => {
  return gulp.src('app/favicon.ico')
  .pipe(gulp.dest(path.join(BUILD_DIR, 'public')));
});

gulp.task('blogIndex', (end) => {
  var blogIndex = [];
  src.blog = 'data/blog/**';
  gulp.src(src.blog)
    .pipe(through.obj(function(chunk, enc, callback) {
      if(chunk.isBuffer()) {
        let contents = chunk.contents.toString('utf8');
        let metadata = fm(contents);
        var data = Object.assign({slug: path.basename(chunk.path).split('.')[0], blog: true}, metadata.attributes);
        if (!metadata.attributes.draft) {
          this.push(data)
        }
      }
      callback()
    }))
    .on('data', function(data) {
      blogIndex.push(data)
    }).on('end', () => {
      fs.writeFile(path.join(BUILD_DIR, 'data', 'blogIndex.json'), JSON.stringify(blogIndex), () => {
        end();
      });
    });
});

gulp.task('move:data', () => {
  src.data = [
    'data/blog/**',
    'data/pages/**'
  ];
  watch(src.data, ['move:data']);
  return gulp.src(src.data)
    .pipe(gulp.dest(path.join(BUILD_DIR, 'data')));
});

gulp.task('move:assets', () => {
  src.assets = [
    'app/assets*/**'
  ];

  watch(src.assets, ['move:assets']);

  return gulp.src(src.assets)
    .pipe(gulp.dest(PUBLIC_DIR));
});

gulp.task('move:index', () => {
  src.index = [
    path.join(APP_DIR, 'index.html')
  ];

  watch(src.index, ['move:index']);
  watch(src.blog, ['move:index']);

  return gulp.src(src.index)
    .pipe(gulp.dest(PUBLIC_DIR));
});

gulp.task('compile:sass', () => {
  src.sass = [
    path.join(APP_DIR, 'style.scss')
  ];

  watch(src.sass, ['compile:sass']);

  var stream = gulp.src(src.sass)
    .pipe($.plumber())
    .pipe($.sass());

  if (!DEBUG) {
    stream = stream.pipe($.minifyCss())
  }
  return stream.pipe(gulp.dest(PUBLIC_DIR));
});

gulp.task('watch', cb => {
  watch_array.forEach(watch => {
    gulp.watch(watch.pattern, watch.tasks);
  });
  cb();
});

gulp.task('move', done => {
  runSequence(['move:assets', 'move:index', 'move:data', 'move:favicon'], done)
});

gulp.task('build', cb => {
  runSequence(['move', 'blogIndex', 'compile:sass', 'bundle:vendors', 'bundle'], cb)
});

gulp.task('default', done => {
  runSequence(['clean'], ['build'], ['watch'], done)
});