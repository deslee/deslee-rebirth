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

import { canUseDOM } from '../node_modules/react/lib/ExecutionEnvironment';


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
    <Route name="data" path="/:id" handler={DataPage} />
    <NotFoundRoute handler={NotFoundPage} />
  </Route>
);

export var staticPaths = [];
function processRoute(route) {
  if (route.props.path && route.props.path.indexOf(':') == -1 && route.props.path !== '/') {
    staticPaths.push(route.props.path);
  }
  if (route.props.children) {
    route.props.children.forEach(processRoute);
  }
}
processRoute(routes);

export function render(path, cb) {
  Router.run(routes, path, Root => {
    var pageNotFound = false;
    var css = [];
    if (typeof GLOBAL !== 'undefined') {
      GLOBAL.app_callbacks = {
        onPageNotFound: () => pageNotFound = true,
        onInsertCss: value => {
          css.push(value)
        }
      };
    }
    var html = React.renderToString(<Root />);
    cb(html, {pageNotFound, css});
  })
}

if (canUseDOM) {
  Router.run(routes, Router.HistoryLocation, Root => {
    React.render(<Root />, document.getElementById('container'));
  });
}