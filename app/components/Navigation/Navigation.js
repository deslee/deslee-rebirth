import React from 'react/addons';
import {Link} from 'react-router';
import styles from './Navigation.scss';
import withStyles from '../../decorators/withStyles.js';

@withStyles(styles)
class Navigation extends React.Component {
  render() {
    return (<div className="navigation">
      <span className="nav-item"><Link to="index">Home</Link></span>
      <span className="nav-item"><Link to="data" params={{id: 'about'}}>About</Link></span>
      <span className="nav-item"><Link to="data" params={{id: 'projects'}}>Projects</Link></span>
    </div>)
  }
}

export default Navigation;