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
import through from 'through2';
import fm from 'front-matter';
import fs from 'fs';
import vinylMap from 'vinyl-map';

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
    mkdirp('build/public', () => {
      mkdirp('build/data', done);
    });
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
    /*.pipe(vinylMap((code, fileName) => {
      code = code.toString();
      let json = JSON.stringify(blogIndex);
      var idx = code.indexOf('<body>') + '<body>'.length;
      code = code.substring(0, idx) + `\n<div id="blogIndex" data-blogIndex='${json}'></div>` + code.slice(idx);
      return code
    }))*/
    .pipe(gulp.dest(PUBLIC_DIR));
});

gulp.task('move:css', () => {
  return gulp.src('node_modules/basscss/css/basscss*.css')
  .pipe(gulp.dest(path.join(BUILD_DIR, 'public')));
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

gulp.task('data', cb => {
  var index = [];
  src.blog = 'data*/**';
  gulp.src(src.blog)
    .pipe(through.obj(function(chunk, enc, callback) {
      if(chunk.isBuffer()) {
        var isBlog = chunk.relative.split(path.sep).length >= 2 ? chunk.relative.split(path.sep)[1].toLowerCase() === 'blog' : false;
        let contents = chunk.contents.toString('utf8');
        let metadata = fm(contents);
        var data = Object.assign({slug: path.basename(chunk.path).split('.')[0], blog: isBlog}, metadata.attributes);
        if (!metadata.attributes.draft) {
          this.push(data)
        }
      }
      callback()
    }))
    .on('data', function(data) {
      index.push(data)
    })
    .on('end', function() {
      let json = JSON.stringify(index);
      let contents = `
// gulp generated file
export default JSON.parse('${json}');
`;
      cb();
      //fs.writeFile('src/content/Blog.js', contents, cb);
    })
});

gulp.task('move', done => {
  runSequence(['move:assets', 'move:index', 'move:data', 'move:css'], done)
});

gulp.task('build', cb => {
  runSequence(['move', 'blogIndex', 'compile:sass', 'bundle', 'data'], cb)
});

gulp.task('default', done => {
  runSequence(['clean'], ['build'], ['watch'], done)
});