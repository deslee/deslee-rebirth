'use strict';

import {Dispatcher} from 'flux';
import PayloadSources from './constants/PayloadSources';

var AppDispatcher = Object.assign(new Dispatcher(), {
  /**
   * @param {object} action The details of the action, including the action's
   * type and additional data coming from the server.
   */
  handleServerAction() {
    var payload = {
      source: PayloadSources.SERVER_ACTION,
      action
    };
    this.dispatch(payload);
  },

  /**
   * @param {object} action The details of the action, including the action's
   * type and additional data coming from the view.
   */
  handleViewAction(action) {
    var payload = {
      source: PayloadSources.VIEW_ACTION,
      action
    };
    this.dispatch(payload);
  }

});

export default AppDispatcher;
