import React from 'react/addons';
import {RouteHandler} from 'react-router';
import PostsPage from '../PostsPage/PostsPage.js';
import DataStore from '../../store/DataStore.js';
import styles from './IndexPage.scss';
import withStyles from '../../decorators/withStyles.js';

@withStyles(styles)
class IndexPage extends React.Component {
  componentWillMount() {
    if (typeof GLOBAL !== 'undefined' && GLOBAL.app_callbacks && GLOBAL.app_callbacks.onSetTitle) {
      GLOBAL.app_callbacks.onSetTitle('Desmond Lee')
    }
  }
  render() {
    return <PostsPage posts={DataStore.getData('blogIndex')} />
  }
}

export default IndexPage;