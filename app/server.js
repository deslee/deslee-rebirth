'use strict';
import 'babel/polyfill';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import express from 'express';

import * as app from './app.js';
import AppDispatcher from './AppDispatcher.js';
import ActionTypes from './constants/ActionTypes.js';
import DataStore from './store/DataStore.js';

const server = express();
server.set('port', (process.env.PORT || 5000));

const templateFile = './public/index.html';
const template = _.template(fs.readFileSync(templateFile, 'utf8'));

function isomorphicRequest(req, res, next) {
  app.render(req.path, body => {
    try {
      let data = {
        body,
        description: '',
        css: [],
        initialData: req.initialData ? JSON.stringify(req.initialData) : null
      };

      let html = template(data);
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
      if (id === 'example-data') {
        resolve({
          id,
          value: id + ' data'
        });
      }
      else {
        reject('not found');
      }
    }, 200);
  })
}

server.get(/^\/$|^\/index\.html/, isomorphicRequest);
server.use(express.static('public'));
server.get('/:id', (req, res, next) => {
  console.log('test', req.params.id)
  getData(req.params.id).then(data => {
    /*AppDispatcher.handleServerAction({
     type: ActionTypes.RECEIVE_DATA,
     id: req.params.id,
     data: data
     });*/
    var initial = {}
    initial[data.id] = data.value
    DataStore.data = initial;
    req.initialData = initial;
    next();
  }).catch(err => {
    if (err !== 'not found' && err.stack) {
      console.log('er', err.stack)
    }
    next();
  });
});
server.get('/data/:id', (req, res, next) => {
  getData(req.params.id).then(data => {
    res.send(data);
  })
});
server.get('*', isomorphicRequest);

server.listen(server.get('port'), () => {
  if (process.send) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + server.get('port'));
  }
});