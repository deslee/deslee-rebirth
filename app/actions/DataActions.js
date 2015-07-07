import AppDispatcher from '../AppDispatcher.js';
import ActionTypes from '../constants/ActionTypes.js';
import http from 'superagent';

export default {
  requestData(id, cb) {
    if (typeof document !== 'undefined') {
      http.get('/data/' + id)
        .accept('application/json')
        .end((err, res) => {
          AppDispatcher.handleServerAction({
            type: ActionTypes.RECEIVE_DATA,
            err,
            id,
            data: res ? res.body : null
          });
          if (cb) {
            cb();
          }
        });
    }

  }
}