import React from 'react/addons';
import {RouteHandler} from 'react-router';
import PostsPage from '../PostsPage/PostsPage.js';
import DataStore from '../../store/DataStore.js';
import styles from './IndexPage.scss';
import withStyles from '../../decorators/withStyles.js';

@withStyles(styles)
class IndexPage extends React.Component {
  render() {
    return <PostsPage posts={DataStore.getData('blogIndex')} />
  }
}

export default IndexPage;