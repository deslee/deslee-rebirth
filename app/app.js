'use strict';
import 'babel/polyfill';
import React from 'react/addons';
import Router, {DefaultRoute, Route, NotFoundRoute} from 'react-router';

import AppDispatcher from './AppDispatcher.js';
import DataStore from './store/DataStore.js';
import ActionTypes from './constants/ActionTypes.js';

import App from "./components/App/App.js"
import AsyncElement from "./helpers/AsyncElement.js"

import IndexPage from "./components/IndexPage/IndexPage.js"
import ExamplePage from "./components/ExamplePage/ExamplePage.js"
import DataPage from "./components/DataPage/DataPage.js"
import NotFoundPage from "./components/NotFoundPage/NotFoundPage.js"


class LazyExamplePage extends AsyncElement {
  constructor() {
    super();
    this.bundle = require('bundle?lazy!./components/LazyExamplePage/LazyExamplePage.lazy.js');
  }
}

var routes = (
  <Route handler={App} path="/">
    <DefaultRoute name="index" handler={IndexPage} />
    <Route name="example-basic" path="example-basic" handler={ExamplePage} />
    <Route name="example-lazy" path="example-lazy" handler={LazyExamplePage} />
    <Route name="example-data" path="example-data" handler={DataPage} />
    <NotFoundRoute handler={NotFoundPage} />
  </Route>
);

export function render(path, cb) {
  Router.run(routes, path, Root => {
    cb(React.renderToString(<Root />));
  })
}

if (typeof document !== 'undefined') {
  Router.run(routes, Router.HistoryLocation, Root => {
    React.render(<Root />, document.getElementById('container'));
  });
}

