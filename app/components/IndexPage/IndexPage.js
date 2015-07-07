import React from 'react/addons';
import {RouteHandler} from 'react-router';
import styles from './IndexPage.scss';
import withStyles from '../../decorators/withStyles.js';

@withStyles(styles)
class IndexPage extends React.Component {
  render() {
    return <p className="IndexPage">Index Page</p>
  }
}

export default IndexPage;