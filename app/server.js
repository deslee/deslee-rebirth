'use strict';
import 'babel/polyfill';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import express from 'express';

import * as app from './app.js';

const server = express();
server.set('port', (process.env.PORT || 5000));

const templateFile = './public/index.html';
const template = _.template(fs.readFileSync(templateFile, 'utf8'));

function isomorphicRequest(req, res) {
  app.render(req.path, body => {
    try {
      let data = {
        body,
        description: '',
        css: [],
      };
      let html = template(data);
      res.send(html);
    } catch (err) {
      next(err);
    }
  })
}

server.get(/^\/$|^\/index\.html/, function(req, res) {
  isomorphicRequest(req, res)
});
server.use(express.static('public'));
server.get('*', function(req, res) {
  isomorphicRequest(req, res)
});

app.render('/example-lazy', console.log)

server.listen(server.get('port'), () => {
  if (process.send) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + server.get('port'));
  }
});