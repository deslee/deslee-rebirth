import React from 'react/addons';
import DataStore from '../store/DataStore.js';
import DataActions from '../actions/DataActions.js'

export default class DataElement extends React.Component {
  constructor() {
    super();

    this.state = {
      dataStore: DataStore.getData()
    };
  }
  dataEvent() {
    var data = DataStore.getData();
    if (data) {
      this.setState({dataStore:data})
    }
  }
  componentWillMount() {
    this._dataStoreCallBack = this.dataEvent.bind(this);
    DataStore.onChange(this._dataStoreCallBack);
  }
  componentWillUnmount() {
    DataStore.off(this._dataStoreCallBack);
  }
}