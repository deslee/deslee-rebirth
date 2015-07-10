'use strict';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import fm from 'front-matter';
import express from 'express';
import marked from 'marked';
import bodyParser from 'body-parser';
import jade from 'jade';
import * as app from './app.js';
import AppDispatcher from './AppDispatcher.js';
import ActionTypes from './constants/ActionTypes.js';
import DataStore from './store/DataStore.js';

import {twitterMiddleWare, getTimeline as getTwitterTimeline} from './backend/twitter.js';
import {emailMiddleWare} from './backend/email.js';

const server = express();
server.set('port', (process.env.PORT || 5000));

const templateFile = '../build/public/index.html';
const template = _.template(fs.readFileSync(templateFile, 'utf8'));

const blogIndex = JSON.parse(fs.readFileSync('../build/data/blogIndex.json'));


var dataCache = {
};

function encodeQueryData(data)
{
  var ret = [];
  for (var d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
}

// generate memory cache
fs.readdirSync('../build/data/').forEach(file => {
  let contents = fs.readFileSync(path.join('../build/data/', file), {encoding: 'utf8'});
  let content;
  let ext = path.extname(file);
  switch(ext) {
    case '.md':
      content = fm(contents);
      content.body = marked(content.body);
      break;
    case '.jade':
      content = fm(contents);
      content.body = jade.render(content.body, null, '  ');
      break;
    case '.json':
      content = JSON.parse(contents);
      break;
  }
  let id = path.basename(file, ext);
  dataCache[id] = content;
});

async function isomorphicRequest(req, res, next) {
  if (!req.initialData) {
    req.initialData = {};
  }

  if (!req.dataContext) {
    req.dataContext = [];
  }

  req.dataContext.push('twitter');

  var tweets = await getTwitterTimeline();

  req.initialData.blogIndex = blogIndex;
  req.initialData.twitter = tweets;
  DataStore.data = req.initialData;

  app.render(req.path + (Boolean(Object.keys(req.query).length) ? '?' : '') + encodeQueryData(req.query), (body, status) => {
    try {
      let data = {
        body,
        description: '',
        css: status.css.join('\n'),
        /*initialData: req.initialData ? JSON.stringify(req.initialData) : null,*/
        dataContext: JSON.stringify(req.dataContext),
        /*tweets: JSON.stringify(tweets),*/
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

// '/data/:id'
function apiRequest(req, res, next) {
  if (req.params.id == 'dataCache') {
    res.send(dataCache);
  }
  else {
    getData(req.params.id).then(data => {
      res.send(data);
    }).catch(err => {
      res.status(404).end();
    })
  }
}

// '/:id'
function initialDataMiddleware(req, res, next) {
  if (app.staticPaths.indexOf(req.params.id) !== -1) {
    next();
  }

  getData(req.params.id).then(data => {
    var initial = {};

    if (!req.dataContext) {
      req.dataContext = [];
    }

    req.dataContext.push(req.params.id);

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
}

server.use(bodyParser());
server.get(/^\/$|^\/index\.html/, isomorphicRequest);
server.get('/data/twitter', twitterMiddleWare('twitter'));
server.post('/send_email', emailMiddleWare);
server.get('/data/:id', apiRequest);
server.use(express.static('../build/public'));
server.get('/:id', initialDataMiddleware);
server.get('*', isomorphicRequest);

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

server.listen(server.get('port'), () => {
  if (process.send) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + server.get('port'));
  }
});
