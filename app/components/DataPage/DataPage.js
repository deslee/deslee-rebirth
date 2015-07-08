import React from 'react/addons';
import DataStore from '../../store/DataStore.js';
import DataActions from '../../actions/DataActions.js';
import DataElement from '../../helpers/DataElement.js';
import NotFoundPage from "../NotFoundPage/NotFoundPage.js"
import Loading from "../Loading/Loading.js";

export default class DataPage extends DataElement {
  constructor() {
    super();
  }
  componentWillMount() {
    super.componentWillMount();
    if (!this.state.dataStore[this.props.params.id]) {
      DataActions.requestData(this.props.params.id);
    }
    if (typeof GLOBAL !== 'undefined' && GLOBAL.app_callbacks && GLOBAL.app_callbacks.onSetTitle) {
      GLOBAL.app_callbacks.onSetTitle(this.props.params.id)
    }
  }
  componentWillReceiveProps(props) {
    if (this.props.params.id !== props.params.id) {
      if (!this.state.dataStore[this.props.params.id]) {
        DataActions.requestData(this.props.params.id);
      }
    }
  }
  render() {
    var data = this.state.dataStore[this.props.params.id];
    if (data && data.body) {
      if (typeof GLOBAL !== 'undefined' && GLOBAL.app_callbacks && GLOBAL.app_callbacks.onSetTitle) {
        GLOBAL.app_callbacks.onSetTitle(data.attributes.title)
      }
      return (
        <div className="DataPage">
          <h1>{data.attributes.title}</h1>
          <div dangerouslySetInnerHTML={{__html: data.body}}></div>
        </div>
      )
    } else if (data == null && data !== undefined) {
      return <NotFoundPage />
    } else {
      return <Loading />
    }
  }
}
