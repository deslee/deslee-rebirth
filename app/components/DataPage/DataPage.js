import React from 'react/addons';
import DataStore from '../../store/DataStore.js';
import DataActions from '../../actions/DataActions.js';
import DataElement from '../../helpers/DataElement.js';
import NotFoundPage from "../NotFoundPage/NotFoundPage.js"
import Loading from "../Loading/Loading.js";
import Tags from "../Tags/Tags.js";
import moment from 'moment';

export default class DataPage extends DataElement {
  constructor() {
    super();
  }
  setTitle(title) {
    if (typeof GLOBAL !== 'undefined' && GLOBAL.app_callbacks && GLOBAL.app_callbacks.onSetTitle) {
      GLOBAL.app_callbacks.onSetTitle(title)
    }
  }
  updateTitle() {
    var data = this.state.dataStore[this.props.params.id];
    if (data.attributes && data.attributes.title) {
      this.setTitle(data.attributes.title);
    }
  }
  componentWillMount() {
    super.componentWillMount();
    if (!this.state.dataStore[this.props.params.id]) {
      DataActions.requestData(this.props.params.id);
      this.setTitle(this.props.params.id);
    } else {
      this.updateTitle();
    }

    this.state._updateTitle = this.updateTitle.bind(this);
    DataStore.onChange(this.state._updateTitle);
  }
  componentWillReceiveProps(props) {
    if (this.props.params.id !== props.params.id) {
      if (!this.state.dataStore[props.params.id]) {
        DataActions.requestData(props.params.id);
      }
    }
  }
  componentWillUnmount() {
    DataStore.off(this.state._updateTitle);
  }
  render() {
    var data = this.state.dataStore[this.props.params.id];
    if (data && data.body) {
      let tags;
      if(data.attributes && data.attributes.tags) {
        tags = <Tags tags={data.attributes.tags} />
      }

      var time;
      if (data.attributes && data.attributes.date) {
        var m = moment(new Date(data.attributes.date));
        time = <time className="mr1" dateTime={m.format('YYYY-MM-DD')}>{m.format('YYYY-MM-DD')}</time>;
      }

      return (
        <div className="DataPage">
          <h1 className="mb1">{data.attributes.title}</h1>
          {time}
          {tags}
          <div className="mt2" dangerouslySetInnerHTML={{__html: data.body}}></div>
        </div>
      )
    } else if (data == null && data !== undefined) {
      return <NotFoundPage />
    } else {
      return <Loading />
    }
  }
}
