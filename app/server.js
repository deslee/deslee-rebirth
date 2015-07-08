'use strict';
import 'babel/polyfill';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import fm from 'front-matter';
import express from 'express';
import marked from 'marked';
import jade from 'jade';

import * as app from './app.js';
import AppDispatcher from './AppDispatcher.js';
import ActionTypes from './constants/ActionTypes.js';
import DataStore from './store/DataStore.js';

const server = express();
server.set('port', (process.env.PORT || 5000));

const templateFile = './public/index.html';
const template = _.template(fs.readFileSync(templateFile, 'utf8'));

const blogIndex = JSON.parse(fs.readFileSync('./data/blogIndex.json'));

var dataCache = {
};

fs.readdirSync('./data/').forEach(file => {
  let contents = fs.readFileSync(path.join('./data/', file), {encoding: 'utf8'});
  let content = fm(contents);
  let ext = path.extname(file);
  switch(ext) {
    case '.md':
      content.body = marked(content.body);
      break;
    case '.jade':
      content.body = jade.render(content.body, null, '  ');
      break;
  }
  let id = path.basename(file, ext);
  dataCache[id] = content;
});

function isomorphicRequest(req, res, next) {
  if (!req.initialData) {
    req.initialData = {};
  }
  req.initialData.blogIndex = blogIndex;
  DataStore.data = req.initialData;

  app.render(req.path, (body, status) => {
    try {
      let data = {
        body,
        description: '',
        css: status.css.join('\n'),
        initialData: req.initialData ? JSON.stringify(req.initialData) : null,
        pageTitle: status.pageTitle
      };

      let html = template(data);

      if (status.pageNotFound || req.notFound) {
        res.status(404);
      }

      res.send(html);
    } catch (err) {
      console.log(err);
      next();
    }
  })
}

// simulates a database dictionary or document
function getData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      var value = dataCache[id];
      if (value) {
        resolve({
          id,
          value
        });
      }
      else {
        reject('not found');
      }
    }, 200);
  })
}

server.get(/^\/$|^\/index\.html/, isomorphicRequest);
server.get('/data/:id', (req, res, next) => {
  getData(req.params.id).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(404).end();
  })
});
server.use(express.static('public'));
server.get('/:id', (req, res, next) => {
  if (app.staticPaths.indexOf(req.params.id) !== -1) {
    next();
  }

  getData(req.params.id).then(data => {
    var initial = {};
    initial[data.id] = data.value;
    req.initialData = initial;
    next();
  }).catch(err => {
    if (err !== 'not found' && err.stack) {
      console.log('er', err.stack)
    }
    var initial = {};
    initial[req.params.id] = null;
    req.initialData = initial;
    req.notFound = true;
    next();
  });
});
server.get('*', isomorphicRequest);

server.listen(server.get('port'), () => {
  if (process.send) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + server.get('port'));
  }
});