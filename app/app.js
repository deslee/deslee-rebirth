'use strict';
import React from 'react/addons';
import Router, {DefaultRoute, Route, NotFoundRoute} from 'react-router';

import AppDispatcher from './AppDispatcher.js';
import DataStore from './store/DataStore.js';
import ActionTypes from './constants/ActionTypes.js';
import DataActions from './actions/DataActions.js'

import App from "./components/App/App.js"
import AsyncElement from "./helpers/AsyncElement.js"

import IndexPage from "./components/IndexPage/IndexPage.js"
import AboutMePage from "./components/AboutMePage/AboutMePage.js"
import DataPage from "./components/DataPage/DataPage.js"
import NotFoundPage from "./components/NotFoundPage/NotFoundPage.js"
import TagsPage from "./components/TagsPage/TagsPage.js"
import EmailSentPage from "./components/EmailSentPage/EmailSentPage.js"

import { canUseDOM } from '../node_modules/react/lib/ExecutionEnvironment';


var routes = (
  <Route handler={App} path="/">
    <DefaultRoute name="index" handler={IndexPage} />
    <Route name="about" path="about" handler={AboutMePage} />
    <Route name="email-sent" path="email-sent" handler={EmailSentPage} />
    <Route name="tags-page" path="tags/:tags" handler={TagsPage} />
    <Route name="data" path=":id" handler={DataPage} />
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
    var pageTitle = '';
    if (typeof GLOBAL !== 'undefined') {
      GLOBAL.app_callbacks = {
        onPageNotFound: () => pageNotFound = true,
        onInsertCss: value => {
          css.push(value)
        },
        onSetTitle: title => pageTitle = title
      };
    }
    var html = React.renderToString(<Root />);
    cb(html, {pageNotFound, css, pageTitle});
  })
}

export default function() {

  if (canUseDOM) {
    window.GLOBAL = {
      app_callbacks: {
        onSetTitle: title => document.title = title
      }
    };

    let promises = [
      new Promise(resolve => {
        if (window.addEventListener) {
          window.addEventListener('DOMContentLoaded', function() {
            resolve();
          });
        } else {
          window.attachEvent('onload', function() {
            resolve();
          });
        }
      }),

      new Promise(resolve => {
        DataActions.requestData('blogIndex', function() {
          resolve();
        });
      })
    ];

    promises = promises.concat(appFluxInitialDataContext.map(id => {
      return new Promise(resolve => {
        DataActions.requestData(id, function() {
          resolve();
        });
      });
    }));

    Promise.all(promises).then(() => {
      Router.run(routes, Router.HistoryLocation, Root => {
        React.render(<Root />, document.getElementById('container'));
      });
      DataActions.requestCache();
    });

  }
}