import React from 'react/addons';
import DataStore from '../../store/DataStore.js';
import DataActions from '../../actions/DataActions.js';
import DataElement from '../../helpers/DataElement.js';

export default class DataPage extends DataElement {
  constructor() {
    super();
  }
  componentWillMount() {
    super.componentWillMount();
    DataActions.requestData('example-data');
  }
  render() {
    var data = this.state.dataStore['example-data'];
    return (<div>
      <p>DataPage</p>
      <p>Data: {data?data:"Loading"}</p>
    </div>)
  }
}
