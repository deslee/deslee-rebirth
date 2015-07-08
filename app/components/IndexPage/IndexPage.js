import React from 'react/addons';
import {RouteHandler} from 'react-router';
import PostsPage from '../PostsPage/PostsPage.js';
import DataStore from '../../store/DataStore.js';
import DataElement from '../../helpers/DataElement.js';
import DataActions from '../../actions/DataActions.js';
import styles from './IndexPage.scss';
import withStyles from '../../decorators/withStyles.js';

@withStyles(styles)
class IndexPage extends DataElement {
  constructor() {
    super();
  }
  componentWillMount() {
    super.componentWillMount();
    if (typeof GLOBAL !== 'undefined' && GLOBAL.app_callbacks && GLOBAL.app_callbacks.onSetTitle) {
      GLOBAL.app_callbacks.onSetTitle('Desmond Lee')
    }

    if (!this.state.dataStore.blogIndex) {
      DataActions.requestData('blogIndex');
    }
  }
  render() {
    if (!this.state.dataStore.blogIndex) {
      return <PostsPage posts={[]} />
    }
    else {
      return <PostsPage posts={DataStore.getData('blogIndex')} />
    }

  }
}

export default IndexPage;