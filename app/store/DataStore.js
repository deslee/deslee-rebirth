import EventEmitter from 'eventemitter3';
import AppDispatcher from '../AppDispatcher.js';
import ActionTypes from '../constants/ActionTypes.js';
import PayloadSources from '../constants/PayloadSources';

const CHANGE_EVENT = 'change';

var initialData = {}
if (typeof document !== 'undefined') {
  var container = document.getElementById('container');
  var dataString;
  if (container && (dataString = container.getAttribute('data-initial'))) {
    var obj = JSON.parse(dataString);
    initialData = obj;
  }
}

var DataStore = Object.assign({}, EventEmitter.prototype, {
  data: initialData,
  /**
   * Gets page data by the given URL path.
   *
   * @param {String} path URL path.
   * @returns {*} Page data.
   */
    getData(id) {
      if (!id) {
        return this.data;
      }
      return this.data[id];
    },

  /**
   * Emits change event to all registered event listeners.
   *
   * @returns {Boolean} Indication if we've emitted an event.
   */
    emitChange() {
      return this.emit(CHANGE_EVENT);
    },

  /**
   * Register a new change event listener.
   *
   * @param {function} callback Callback function.
   */
    onChange(callback) {
      this.on(CHANGE_EVENT, callback);
    },

  /**
   * Remove change event listener.
   *
   * @param {function} callback Callback function.
   */
    off(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }
});

function serverActions(action) {
  switch(action.type) {
    case ActionTypes.RECEIVE_DATA:
      if (!action.err && action.data) {
        DataStore.data[action.data.id] = action.data.value;
        DataStore.emitChange();
        break;
      }
  }
}
function viewAction(action) {

}

DataStore.dispatchToken = AppDispatcher.register((payload) => {
  switch (payload.source) {
    case PayloadSources.SERVER_ACTION:
      serverActions(payload.action);
      break;
    case PayloadSources.VIEW_ACTION:
      viewAction(payload.action);
      break;
    default:
  }
});

export default DataStore;
