import AppDispatcher from '../AppDispatcher.js';
import ActionTypes from '../constants/ActionTypes.js';
import http from 'superagent';


import { canUseDOM } from '../../node_modules/react/lib/ExecutionEnvironment';

export default {
  requestCache(cb) {
    if (canUseDOM) {
      http.get('/data/dataCache')
        .accept('application/json')
        .end((err, res) => {
          let isValidJson = (res && res.text && /^[\],:{}\s]*$/.test(res.text.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
          if (isValidJson) {
            let dataCache = JSON.parse(res.text);
            Object.keys(dataCache).forEach(id => {
              AppDispatcher.handleServerAction({
                type: ActionTypes.RECEIVE_DATA,
                err,
                id,
                data: {
                  id,
                  value: dataCache[id]
                }
              });
            })
          }
          if (cb) {
            cb();
          }
        });
    }
  },
  requestData(id, cb) {
    if (canUseDOM) {
      http.get('/data/' + id)
        .accept('application/json')
        .end((err, res) => {
          let isValidJson = (res && res.text && /^[\],:{}\s]*$/.test(res.text.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
          AppDispatcher.handleServerAction({
            type: ActionTypes.RECEIVE_DATA,
            err,
            id,
            data: isValidJson ? JSON.parse(res.text) : null
          });
          if (cb) {
            cb();
          }
        });
    }
  }
}