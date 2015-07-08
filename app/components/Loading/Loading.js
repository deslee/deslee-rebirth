import React, { PropTypes } from 'react/addons';
import {Link} from 'react-router';

import styles from './Loading.scss';
import withStyles from '../../decorators/withStyles.js';

@withStyles(styles)
class Loading extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.state.count = '';
    this.state.interval = undefined;
  }
  componentWillMount() {
    var interval = setInterval(() => {
      if (this.state.count != '········') {
        this.setState({
          count: this.state.count + '·'
        });
      } else {
        this.setState({
          count: ''
        });
      }
    }, 250);
    this.setState({interval});
  }
  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  render() {
    return <div className="DataPage h2 center nowrap">{this.state.count}loading data{this.state.count}</div>
  }
}

export default Loading;
