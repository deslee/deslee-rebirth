import React from 'react/addons';
import DataStore from '../../store/DataStore.js';
import DataActions from '../../actions/DataActions.js';
import DataElement from '../../helpers/DataElement.js';
import NotFoundPage from "../NotFoundPage/NotFoundPage.js"

export default class DataPage extends DataElement {
  constructor() {
    super();
  }
  componentWillMount() {
    super.componentWillMount();
    DataActions.requestData(this.props.params.id);
  }
  render() {
    var data = this.state.dataStore[this.props.params.id];
    if (data && data.body) {
      return (<div className="DataPage" dangerouslySetInnerHTML={{__html: data.body}}></div>)
    } else if (data == null && data !== undefined) {
      return <NotFoundPage />
    } else {
      return <div className="DataPage">loading</div>
    }
  }
}
